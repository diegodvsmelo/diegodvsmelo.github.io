// Uses a fresh headless desktop browser profile; does not attach to personal tabs.
// Usage: node tests/dinoforce-browser.mjs <browser.exe> [url] [output-directory] [port]
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';
const executable = process.argv[2];
if (!executable) throw Error('Provide a Chrome or Edge executable path.');
const url = process.argv[3] || 'http://127.0.0.1:8123/jogos/dinoforce/';
const output = path.resolve(process.argv[4] || '.utmp/WebBrowserSmoke');
const port = Number(process.argv[5] || 9337);
await new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once('error', reject);
  probe.listen(port, '127.0.0.1', () => probe.close(resolve));
});
fs.mkdirSync(output, { recursive: true });
const browser = spawn(executable, [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--enable-unsafe-swiftshader', `--remote-debugging-port=${port}`,
  `--user-data-dir=${path.join(output, 'profile')}`, 'about:blank'
], { windowsHide: true, stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
const events = [];
const allEvents = [];
try {
  let target;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = targets.find(value => value.type === 'page');
      if (target) break;
    } catch {}
    await sleep(200);
  }
  if (!target) throw Error('Browser debugging endpoint unavailable.');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  socket.onmessage = message => {
    const data = JSON.parse(message.data);
    if (!data.id) allEvents.push(data);
    if (data.id) {
      const operation = pending.get(data.id);
      pending.delete(data.id);
      if (operation) data.error ? operation.reject(Error(JSON.stringify(data.error))) : operation.resolve(data.result);
    } else if (data.method === 'Page.javascriptDialogOpening') {
      events.push(data);
      socket.send(JSON.stringify({id:++sequence,method:'Page.handleJavaScriptDialog',params:{accept:true}}));
    } else if (['Runtime.exceptionThrown', 'Runtime.consoleAPICalled', 'Network.loadingFailed', 'Network.responseReceived'].includes(data.method)) {
      events.push(data);
    }
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(Error('CDP timeout: ' + method)); }, 30000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: value => { clearTimeout(timer); reject(value); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const capture = async name => {
    const result = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(result.data, 'base64'));
  };
  const click = async (x, y) => {
    await call('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await call('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  };
  const checks = [];
  const assert = (condition, name, detail) => {
    checks.push({ name, passed: !!condition, detail });
    if (!condition) throw Error(name + ': ' + JSON.stringify(detail));
  };
  const waitFor = async (expression, timeout = 90000) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      try { if (await evaluate(expression)) return; }
      catch (error) { if (!/context|navigated|closed/i.test(error.message)) throw error; }
      await sleep(250);
    }
    throw Error('Timed out: ' + expression);
  };
  const go = async address => {
    await call('Page.navigate', { url: address });
    await waitFor(`document.readyState === 'complete' && location.href === ${JSON.stringify(address)}`);
  };
  const reload = async () => {
    const previousOrigin = await evaluate('performance.timeOrigin');
    await call('Page.reload');
    await waitFor(`performance.timeOrigin !== ${previousOrigin} && document.readyState === 'complete' && document.getElementById('loading')?.hidden`,120000);
  };
  const pointClick = async selector => {
    const r = await evaluate(`(() => {const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    await click(r.x, r.y);
  };
  await Promise.all(['Page.enable', 'Runtime.enable', 'Network.enable'].map(name => call(name)));
  await call('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__audio = [];
    const NativeAudio = window.AudioContext;
    if (NativeAudio) window.AudioContext = class extends NativeAudio {
      constructor(...args) { super(...args); window.__audio.push(this); }
    };
  ` });
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  const origin = new URL(url).origin;
  await go(origin + '/?lang=en');
  await waitFor(`!!document.querySelector('[data-open-project="dinoforce"]')`);
  await evaluate(`document.querySelector('[data-language="pt"]').click()`);
  assert(await evaluate(`document.documentElement.lang === 'pt-BR' && new URLSearchParams(location.search).get('lang') === 'pt'`), 'Language switch updates explicit URL');
  await evaluate(`document.querySelector('[data-language="en"]').click()`);
  assert(!events.some(e => e.params?.response?.url.includes('/player/')), 'Portfolio makes no build requests');
  await evaluate(`document.querySelector('[data-open-project="eita"]').click()`);
  assert(await evaluate(`document.getElementById('project-dialog').open && !document.querySelector('[data-try-dinoforce]')`), 'Other project panel preserved without Try game');
  await evaluate(`document.getElementById('project-dialog').close()`);
  await evaluate(`document.querySelector('[data-open-project="dinoforce"]').scrollIntoView({behavior:'instant',block:'center'}); document.querySelector('[data-open-project="dinoforce"]').click()`);
  assert(await evaluate(`document.querySelector('[data-try-dinoforce]').textContent === 'Try game'`), 'English project button');
  const returnY = await evaluate('scrollY');
  await pointClick('[data-try-dinoforce]');
  await waitFor(`location.pathname === '/jogos/dinoforce/' && document.getElementById('loading')?.hidden`, 120000);
  assert(await evaluate(`location.search.includes('lang=en')`), 'Language preserved');
  await evaluate('history.back()');
  await waitFor(`location.pathname === '/' && document.getElementById('project-dialog')?.open`);
  assert(await evaluate(`document.getElementById('project-dialog').dataset.project === 'dinoforce'`), 'Browser Back restores project panel');
  await pointClick('[data-try-dinoforce]');
  await waitFor(`location.pathname === '/jogos/dinoforce/' && document.getElementById('loading')?.hidden`,120000);
  await sleep(2000);
  const readyState = await evaluate(`(() => {const frame=document.querySelector('iframe');const r=frame.getBoundingClientRect();return {frames:document.querySelectorAll('iframe').length,canvas:frame.contentDocument.querySelectorAll('canvas').length,ratio:r.width/r.height,bottom:r.bottom,width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,ua:navigator.userAgent}})()`);
  assert(readyState.frames === 1 && readyState.canvas === 1, 'Single real initialized player', readyState);
  assert(Math.abs(readyState.ratio - 16/9) < .01 && readyState.bottom < 800 && !readyState.overflow, 'Player fits viewport without distortion', readyState);
  await capture('01-ready');
  const startPoint = await evaluate(`(() => {const f=document.querySelector('iframe'),a=f.getBoundingClientRect(),b=f.contentDocument.getElementById('start-game').getBoundingClientRect();return {x:a.x+b.x+b.width/2,y:a.y+b.y+b.height/2}})()`);
  await click(startPoint.x,startPoint.y);
  await sleep(500);
  checks.push({name:'Audio context after real Start game gesture',detail:await evaluate(`document.querySelector('iframe').contentWindow.__audio.map(a=>({state:a.state,sampleRate:a.sampleRate}))`)});
  const audioPoint = await evaluate(`(() => {const f=document.querySelector('iframe'),r=f.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await click(audioPoint.x, audioPoint.y);
  await sleep(500);
  await capture('01-menu');
  checks.push({name:'Audio context after canvas gesture',detail:await evaluate(`document.querySelector('iframe').contentWindow.__audio.map(a=>({state:a.state,sampleRate:a.sampleRate}))`)});
  await pointClick('#back');
  assert(await evaluate(`document.getElementById('exit-dialog').open && document.getElementById('exit-title').textContent === 'Leave DinoForce?'`), 'Initialized player exit confirmation in English');
  await pointClick('#continue');
  assert(await evaluate(`!document.getElementById('exit-dialog').open`), 'Continue keeps player');
  await pointClick('#fullscreen');
  await waitFor(`!!document.fullscreenElement && document.getElementById('fullscreen').textContent === 'Exit fullscreen'`);
  assert(await evaluate(`document.getElementById('fullscreen').textContent === 'Exit fullscreen'`), 'Fullscreen entry');
  await evaluate(`document.exitFullscreen()`);
  await waitFor(`!document.fullscreenElement && document.getElementById('fullscreen').textContent === 'Fullscreen'`);
  assert(await evaluate(`document.getElementById('fullscreen').textContent === 'Fullscreen'`), 'Fullscreen exit');
  await call('Emulation.setDeviceMetricsOverride', { width: 2560, height: 1440, deviceScaleFactor: 3, mobile: false });
  await sleep(500);
  const buffer = await evaluate(`(() => { const c=document.querySelector('iframe').contentDocument.querySelector('canvas'); return {width:c.width,height:c.height,ratio:c.width/c.height}; })()`);
  assert(buffer.width <= 1920 && buffer.height <= 1080 && Math.abs(buffer.ratio-16/9)<.01, 'High density 2560x1440 desktop respects 1080p buffer cap',buffer);
  await capture('02-high-density');
  await call('Emulation.setDeviceMetricsOverride', { width: 420, height: 800, deviceScaleFactor: 1, mobile: false });
  await sleep(300);
  assert(await evaluate(`!portfolioGame.isMobileDevice() && !document.getElementById('loading').hidden === false && document.documentElement.scrollWidth <= innerWidth`), 'Narrow desktop remains enabled');
  await capture('02-narrow-desktop');
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  // Actually switch to another target, then return to the original page.
  await evaluate(`document.querySelector('iframe').contentDocument.getElementById('resume-game').click()`);
  await sleep(300);
  const activeBefore = await call('Page.captureScreenshot',{format:'png'});
  await sleep(1500);
  const activeAfter = await call('Page.captureScreenshot',{format:'png'});
  checks.push({name:'Scene changes while running',passed:activeBefore.data !== activeAfter.data});
  const alternate = await call('Target.createTarget', {url:'about:blank'});
  await call('Target.activateTarget', {targetId:alternate.targetId});
  await sleep(500);
  await call('Target.activateTarget', {targetId:target.id});
  await waitFor(`!document.querySelector('iframe').contentDocument.getElementById('resume-overlay').hidden`);
  assert(await evaluate(`document.querySelector('iframe').contentDocument.getElementById('pause-text').textContent === 'Game paused'`), 'Existing bridge pause overlay after real tab switch');
  await call('Target.closeTarget', {targetId:alternate.targetId});
  await capture('03-pause');
  // Test-only visibility change: inspect rendered simulation behind the overlay.
  // This does not call pause/resume or change the Unity build.
  await evaluate(`document.querySelector('iframe').contentDocument.getElementById('resume-overlay').style.opacity='0'`);
  await sleep(300);
  const pausedBefore = await call('Page.captureScreenshot',{format:'png'});
  await sleep(2500);
  const pausedAfter = await call('Page.captureScreenshot',{format:'png'});
  checks.push({name:'Pause visual diagnostic (2.5 seconds; not a simulation-state assertion)',identicalFrames:pausedBefore.data === pausedAfter.data,result:pausedBefore.data === pausedAfter.data ? 'stationary rendering observed' : 'inconclusive: rendered frames differ'});
  fs.writeFileSync(path.join(output,'03-paused-scene-before.png'),Buffer.from(pausedBefore.data,'base64'));
  fs.writeFileSync(path.join(output,'03-paused-scene.png'),Buffer.from(pausedAfter.data,'base64'));
  await evaluate(`document.querySelector('iframe').contentDocument.getElementById('resume-overlay').style.opacity=''`);
  await evaluate(`document.querySelector('iframe').contentDocument.getElementById('resume-game').click()`);
  assert(await evaluate(`document.querySelector('iframe').contentDocument.getElementById('resume-overlay').hidden`), 'Existing bridge resume');
  await pointClick('#back'); await pointClick('#exit');
  await waitFor(`location.pathname === '/' && document.getElementById('project-dialog')?.open`);
  assert(await evaluate(`document.getElementById('project-dialog').dataset.project === 'dinoforce' && document.documentElement.lang === 'en' && Math.abs(scrollY-${returnY}) < 4`), 'Return restores panel, language and scroll');
  // Clear request history to distinguish blocked mobile requests.
  events.length = 0;
  await call('Network.setUserAgentOverride',{userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'});
  await go(origin+'/?lang=pt&project=dinoforce#projetos');
  await waitFor(`document.getElementById('project-dialog')?.open`);
  assert(await evaluate(`document.querySelector('[data-try-dinoforce]').disabled && document.getElementById('desktop-only-note').textContent === 'Disponível apenas em computadores.'`), 'Mobile project button blocked');
  await go(origin+'/jogos/dinoforce/?lang=pt');
  assert(await evaluate(`document.querySelectorAll('iframe').length === 0 && document.getElementById('status').textContent === 'Disponível apenas em computadores.'`), 'Mobile direct route blocked');
  await call('Network.setUserAgentOverride',{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15'});
  await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  await go(origin+'/jogos/dinoforce/?lang=en');
  assert(await evaluate(`portfolioGame.isMobileDevice() && !document.querySelector('iframe')`), 'iPad desktop UA blocked');
  assert(!events.some(e=>e.params?.response?.url.includes('/player/')), 'Blocked devices make no build requests');
  await call('Emulation.setTouchEmulationEnabled',{enabled:false});
  await call('Network.setUserAgentOverride',{userAgent:readyState.ua});
  await call('Network.setBlockedURLs',{urls:['*.loader.js*']});
  await go(origin+'/jogos/dinoforce/?lang=pt');
  await waitFor(`!document.getElementById('retry').hidden`);
  assert(await evaluate(`document.getElementById('status').textContent === 'Não foi possível carregar o jogo. Tente novamente.' && document.getElementById('progress').hidden && !document.querySelector('iframe')`), 'Portuguese loader error and complete disposal');
  await capture('04-error-pt');
  await pointClick('#back');
  await waitFor(`location.pathname === '/' && document.getElementById('project-dialog')?.open`);
  assert(await evaluate(`document.getElementById('project-dialog').dataset.project === 'dinoforce'`), 'Direct-link return before initialization');
  await go(origin+'/jogos/dinoforce/?lang=en');
  await waitFor(`!document.getElementById('retry').hidden`);
  assert(await evaluate(`document.getElementById('retry').textContent === 'Try again' && document.getElementById('status').textContent === 'The game could not load. Please try again.'`), 'English error');
  await call('Network.setBlockedURLs',{urls:[]});
  await pointClick('#retry');
  await waitFor(`document.getElementById('loading').hidden`,120000);
  assert(await evaluate(`document.querySelectorAll('iframe').length === 1 && document.querySelector('iframe').contentDocument.querySelectorAll('canvas').length === 1`), 'Retry recovers with one player');
  await reload();
  // No user gesture in the newly loaded page: no native beforeunload prompt.
  await waitFor(`document.readyState === 'complete' && document.getElementById('loading')?.hidden`,120000);
  assert(await evaluate(`location.pathname === '/jogos/dinoforce/'`), 'Direct route reload initializes');
  await capture('05-reloaded');
  await go(origin+'/jogos/dinoforce/?lang=pt');
  await waitFor(`document.getElementById('loading').hidden`,120000);
  await pointClick('#back');
  assert(await evaluate(`document.getElementById('exit-dialog').open && document.getElementById('exit-title').textContent === 'Sair do DinoForce?' && document.getElementById('continue').textContent === 'Continuar jogando'`), 'Portuguese exit confirmation');
  await pointClick('#continue');
  // Simulate absence of the fullscreen capability, without changing the player.
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(document,'fullscreenEnabled',{get:()=>false})`});
  await reload();
  await waitFor(`document.getElementById('loading')?.hidden`,120000);
  assert(await evaluate(`document.getElementById('fullscreen').disabled && document.getElementById('fullscreen-note').textContent === 'Tela cheia indisponível neste navegador.'`), 'Fullscreen API unavailable (capability simulated)');
  await pointClick('#back'); await pointClick('#exit');
  await waitFor(`location.pathname === '/' && document.getElementById('project-dialog')?.open`);
  // Remove cached build downloads so this failure test actually reaches the network.
  await call('Storage.clearDataForOrigin',{origin,storageTypes:'indexeddb,cache_storage'});
  await call('Network.setBlockedURLs',{urls:['*.wasm.unityweb*']});
  await go(origin+'/jogos/dinoforce/?lang=pt');
  await waitFor(`!document.getElementById('retry').hidden`,120000);
  assert(await evaluate(`!document.querySelector('iframe') && document.getElementById('progress').hidden`), 'Wasm initialization failure ends loading and disposes frame');
  await call('Network.setBlockedURLs',{urls:[]});
  await pointClick('#retry');
  await waitFor(`document.getElementById('loading').hidden`,120000);
  assert(await evaluate(`document.querySelectorAll('iframe').length === 1`), 'Retry after initialization failure');
  assert(!allEvents.some(e => e.method === 'Network.responseReceived' && e.params.response.status >= 400 && e.params.response.url.includes('/player/')), 'Real exported resources have no HTTP errors (injected blocking is recorded separately)');
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(checks,null,2));
  console.log(JSON.stringify(checks));
  await call('Browser.close');
} finally {
  fs.writeFileSync(path.join(output,'events.json'),JSON.stringify(events,null,2));
  fs.writeFileSync(path.join(output,'all-events.json'),JSON.stringify(allEvents,null,2));
  socket?.close(); browser.kill();
}
