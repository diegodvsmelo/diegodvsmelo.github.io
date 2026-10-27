// Portfolio regression matrix in a fresh headless Chrome/Edge profile.
// Usage: node tests/portfolio-browser.mjs <browser.exe> [url] [output-directory] [port]
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';
const executable = process.argv[2];
if (!executable) throw Error('Provide a Chrome or Edge executable path.');
const url = process.argv[3] || 'http://127.0.0.1:8123/';
const output = path.resolve(process.argv[4] || '.utmp/PortfolioBrowser');
const port = Number(process.argv[5] || 9338);
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
    await sleep(150);
    const r = await evaluate(`(() => {const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    await click(r.x, r.y);
  };
  await Promise.all(['Page.enable', 'Runtime.enable', 'Network.enable'].map(name => call(name)));
  const origin = new URL(url).origin;
  for (const [width,height,mobile] of [[320,740,true],[360,800,true],[390,844,true],[430,932,true],[844,390,true],[768,1024,false],[1366,900,false]]) {
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    await call('Emulation.setTouchEmulationEnabled',{enabled:mobile});
    await call('Emulation.setUserAgentOverride',{userAgent:mobile?'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36'});
    for (const lang of ['pt','en']) for(const reduce of [false,true]) {
      await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]});
      await go(origin+'/?lang='+lang);
      await waitFor(`document.querySelectorAll('.project-card').length === 2`);
      const label=`${width}x${height}-${lang}-${reduce?'reduce':'normal'}`;
      assert(await evaluate(`siteData.${lang}.projects.map(p=>p.visual).join(',')==='dinoforce,eita' && document.getElementById('projects-count').textContent==='02'`),label+' projects');
      assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),label+' overflow',await evaluate(`({w:innerWidth,s:document.documentElement.scrollWidth,wide:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.className).slice(0,10)})`));
      await evaluate(`window.scrollTo({top:document.body.scrollHeight,behavior:'instant'})`);
      await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
      if(width<=720) {
        await pointClick('#menu-toggle');
        assert(await evaluate(`!document.getElementById('mobile-nav').hidden`),label+' menu opens');
        await pointClick('#mobile-nav a[href="#projetos"]');
        assert(await evaluate(`document.getElementById('mobile-nav').hidden`),label+' menu closes');
      }
      await evaluate(`document.querySelector('.experience-feature [data-open-project="eita"]').click()`);
      assert(await evaluate(`document.getElementById('project-dialog').open`),label+' experience details');
      await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await sleep(30);
      assert(await evaluate(`!document.getElementById('project-dialog').open`),label+' Escape');
      for(const project of ['dinoforce','eita']) {
        await evaluate(`document.querySelector('.project-card [data-open-project="${project}"]').scrollIntoView({behavior:'instant',block:'center'})`);
        const beforeScroll = await evaluate('scrollY');
        await pointClick(`.project-card [data-open-project="${project}"]`);
        await sleep(350);
        assert(await evaluate(`document.getElementById('project-dialog').open`),label+' '+project+' opens',await evaluate(`({scroll:scrollY,rect:document.querySelector('.project-card [data-open-project="${project}"]').getBoundingClientRect().toJSON(),focus:document.activeElement.outerHTML.slice(0,200)})`));
        assert(await evaluate(`document.getElementById('project-dialog').scrollWidth<=document.getElementById('project-dialog').clientWidth`),label+' modal width');
        await evaluate(`document.getElementById('project-dialog-content').scrollTop=100000`);
        if(project==='dinoforce') assert(await evaluate(`document.querySelector('[data-try-dinoforce]').disabled===${mobile}`),label+' device policy');
        if(width===320 && !reduce) await capture(label+'-'+project);
        await pointClick('#project-dialog-close');
        await sleep(30);
        assert(await evaluate(`!document.getElementById('project-dialog').open && !document.body.classList.contains('modal-open') && document.activeElement.dataset.openProject==='${project}'`),label+' closes and restores focus');
        assert(await evaluate(`Math.abs(scrollY-${beforeScroll})<2`),label+' restores scroll');
      }
      await evaluate(`document.querySelector('[data-open-project="eita"]').click()`);
      await evaluate(`setLanguage('${lang==='pt'?'en':'pt'}')`);
      await evaluate(`document.getElementById('project-dialog').close()`);await sleep(30);
      assert(await evaluate(`document.activeElement.isConnected && document.activeElement.dataset.openProject==='eita'`),label+' rerender focus');
      await evaluate(`document.querySelector('.hero-socials a[href^="mailto:"]').click()`);
      assert(await evaluate(`!document.getElementById('mail-fallback').hidden`),label+' contact');
      await evaluate(`navigator.clipboard.writeText=()=>Promise.resolve(); document.getElementById('copy-email').click()`);
      await sleep(30);
      assert(await evaluate(`copyStatusKey==='emailCopied'`),label+' copy success');
      await evaluate(`navigator.clipboard.writeText=()=>Promise.reject(new Error('denied')); document.execCommand=()=>false; document.getElementById('copy-email').click()`);
      await sleep(30);
      assert(await evaluate(`!document.getElementById('mail-copy-status').hidden && copyStatusKey==='emailCopyFailed'`),label+' copy denial');
      await evaluate(`document.getElementById('mail-fallback-close').click()`);
      await evaluate(`document.querySelector('[data-open-project="eita"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true,button:0,clientX:10,clientY:10})); document.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true}))`);
      assert(await evaluate(`!document.querySelector('.juice-squash')`),label+' cancel clears feedback');
      await evaluate(`setLanguage('${lang}');window.scrollTo({top:0,behavior:'instant'})`);
      if(!reduce && [320,390,1366].includes(width)) {
        await capture(label+'-hero');
        await evaluate(`document.getElementById('projetos').scrollIntoView({behavior:'instant'})`);
        await capture(label+'-projects');
        const full = await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:await evaluate(`({x:0,y:0,width:innerWidth,height:document.documentElement.scrollHeight,scale:1})`)});
        fs.writeFileSync(path.join(output,label+'-full.png'),Buffer.from(full.data,'base64'));
      }
      if(width===1366&&!reduce) {
        await evaluate(`document.documentElement.style.zoom='2'`);
        assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`),label+' 200% CSS zoom');
        await evaluate(`document.documentElement.style.zoom=''`);
      }
    }
  }
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
  await go(origin+'/?lang=pt');
  await evaluate(`document.querySelector('[data-open-project="eita"]').click()`);await sleep(350);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',x:120,y:260,button:'left',clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:2,y:260,button:'left',buttons:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:2,y:260,button:'left',clickCount:1});
  assert(await evaluate(`document.getElementById('project-dialog').open`),'Drag from inside to backdrop preserves modal');
  await click(2,260);await sleep(30);
  assert(await evaluate(`!document.getElementById('project-dialog').open`),'Backdrop click closes modal');
  await pointClick('#menu-toggle');await click(15,600);
  assert(await evaluate(`document.getElementById('mobile-nav').hidden`),'Outside click closes menu');
  await pointClick('#menu-toggle');
  await call('Emulation.setDeviceMetricsOverride',{width:1366,height:900,deviceScaleFactor:1,mobile:false});await sleep(50);
  assert(await evaluate(`document.getElementById('mobile-nav').hidden && document.getElementById('menu-toggle').getAttribute('aria-expanded')==='false'`),'Desktop resize resets menu');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await call('Emulation.setTouchEmulationEnabled',{enabled:true});
  await go(origin+'/?lang=en');
  await evaluate(`document.querySelector('.project-card').scrollIntoView({behavior:'instant',block:'center'})`);
  const touchPoint = await evaluate(`(() => {const r=document.querySelector('.project-card').getBoundingClientRect();return {x:r.x+80,y:Math.max(200,r.y+60)}})()`);
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touchPoint]});
  for(let i=1;i<=5;i++) {await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchPoint.x,y:touchPoint.y-i*22}]});await sleep(30);}
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(1000);
  assert(await evaluate(`!document.getElementById('project-dialog').open && !document.querySelector('.juice-squash')`),'Real emulated touch scroll does not activate card or retain squash');
  await evaluate(`document.querySelector('.project-card').scrollIntoView({behavior:'instant',block:'center'})`);
  await sleep(150);
  const tapPoint = await evaluate(`(() => {const r=document.querySelector('.project-card').getBoundingClientRect();return {x:r.x+80,y:Math.max(200,r.y+60)}})()`);
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[tapPoint]});
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(350);
  assert(await evaluate(`document.getElementById('project-dialog').open && !document.querySelector('.juice-squash')`),'Single emulated tap opens project and clears feedback');
  await pointClick('#project-dialog-close');
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
  await pointClick('[data-language="pt"]');
  await go(origin+'/');
  assert(await evaluate(`document.documentElement.lang==='pt-BR' && localStorage.getItem('portfolio-language')==='pt'`),'Language preference persists on reload without query');
  await evaluate(`document.querySelector('.experience-feature [data-open-project="eita"]').click()`);
  for(let i=0;i<6;i++) {
    await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    assert(await evaluate(`document.getElementById('project-dialog').contains(document.activeElement)`),'Native dialog retains keyboard focus '+i);
  }
  await pointClick('#project-dialog-close');
  await call('Browser.grantPermissions',{origin,permissions:['clipboardReadWrite','clipboardSanitizedWrite']});
  await evaluate(`document.querySelector('.hero-socials a[href^="mailto:"]').click()`);
  await pointClick('#copy-email');
  await sleep(100);
  assert(await evaluate(`(async () => copyStatusKey==='emailCopied' && (await navigator.clipboard.readText())===siteData.contactEmail)()`),'Native clipboard copies real address');
  await pointClick('#mail-fallback-close');
  await evaluate(`document.querySelector('.footer-links a[href="#inicio"]').click()`);await sleep(700);
  assert(await evaluate(`scrollY<2`),'Back to top anchor');
  assert(!events.some(e=>e.method==='Runtime.exceptionThrown'),'No uncaught exceptions');
  assert(!events.some(e=>e.method==='Network.responseReceived'&&e.params.response.status>=400),'No portfolio HTTP errors');
  assert(!events.some(e=>e.params?.response?.url.includes('/player/')),'No Unity assets during portfolio navigation');
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(checks,null,2));
  console.log(`${checks.length} checks passed`);
  await call('Browser.close');
} finally {
  fs.writeFileSync(path.join(output,'events.json'),JSON.stringify(events,null,2));
  fs.writeFileSync(path.join(output,'all-events.json'),JSON.stringify(allEvents,null,2));
  socket?.close(); browser.kill();
}
