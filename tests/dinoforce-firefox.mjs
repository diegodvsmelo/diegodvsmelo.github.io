// Native Firefox WebDriver BiDi, without a driver download or personal profile.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';
await new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once('error', reject);
  probe.listen(9339, '127.0.0.1', () => probe.close(resolve));
});
const output = path.resolve('.utmp/firefox');
fs.mkdirSync(path.join(output, 'profile'), { recursive: true });
const browser = spawn(process.argv[2] || 'C:/Program Files/Mozilla Firefox/firefox.exe', [
  '--headless', '--no-remote', '--profile', path.join(output, 'profile'), '--remote-debugging-port', '9339'
], { windowsHide: true, stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
const events = [];
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      socket = new WebSocket('ws://127.0.0.1:9339/session');
      await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
      break;
    } catch { socket?.close(); socket = null; await sleep(200); }
  }
  if (!socket) throw Error('Firefox BiDi endpoint unavailable.');
  let sequence = 0;
  const pending = new Map();
  socket.onmessage = message => {
    const data = JSON.parse(message.data);
    if (data.id) {
      const item = pending.get(data.id);
      pending.delete(data.id);
      if (item) data.type === 'error' ? item.reject(Error(JSON.stringify(data))) : item.resolve(data.result);
    } else events.push(data);
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(Error('BiDi timeout: ' + method)); }, 30000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const session = await call('session.new', { capabilities: {} });
  await call('session.subscribe', { events: ['log.entryAdded', 'network.responseCompleted', 'network.fetchError'] });
  const { context } = await call('browsingContext.create', { type: 'tab' });
  await call('browsingContext.setViewport', { context, viewport: { width: 1280, height: 800 }, devicePixelRatio: 1 });
  const evaluate = async expression => {
    const result = await call('script.evaluate', { expression, target: { context }, awaitPromise: true });
    if (result.type === 'exception') throw Error(JSON.stringify(result));
    return result.result.value;
  };
  const capture = async name => {
    const result = await call('browsingContext.captureScreenshot', { context });
    fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(result.data, 'base64'));
  };
  await call('browsingContext.navigate', { context, url: process.argv[3] || 'http://127.0.0.1:8124/jogos/dinoforce/?lang=pt', wait: 'complete' });
  await capture('01-before-play');
  let ready = false;
  for (let attempt = 0; attempt < 180; attempt++) {
    ready = await evaluate(`!!document.getElementById('loading').hidden`);
    if (ready) break;
    await sleep(1000);
  }
  await sleep(3000);
  const point = JSON.parse(await evaluate(`JSON.stringify((() => {const f=document.querySelector('iframe');const a=f.getBoundingClientRect();const b=f.contentDocument.getElementById('start-game').getBoundingClientRect();return {x:Math.round(a.x+b.x+b.width/2),y:Math.round(a.y+b.y+b.height/2)}})())`));
  await call('input.performActions', { context, actions: [{ type: 'pointer', id: 'mouse', parameters: { pointerType: 'mouse' }, actions: [
    { type: 'pointerMove', x: point.x, y: point.y, origin: 'viewport' },
    { type: 'pointerDown', button: 0 }, { type: 'pointerUp', button: 0 }
  ] }] });
  await sleep(1000);
  await capture('02-loaded');
  const state = JSON.parse(await evaluate(`JSON.stringify({ready:document.getElementById('loading').hidden,canvas:[document.querySelector('iframe').contentDocument.querySelector('canvas').width,document.querySelector('iframe').contentDocument.querySelector('canvas').height],url:location.href,userAgent:navigator.userAgent,frames:document.querySelectorAll('iframe').length,startOverlayHidden:document.querySelector('iframe').contentDocument.getElementById('audio-overlay').hidden})`));
  state.capabilities = session.capabilities;
  state.context = context;
  fs.writeFileSync(path.join(output, 'state.json'), JSON.stringify(state, null, 2));
  console.log(JSON.stringify(state));
  if (!ready) process.exitCode = 1;
  await call('session.end');
} finally {
  fs.writeFileSync(path.join(output, 'events.json'), JSON.stringify(events, null, 2));
  socket?.close();
  browser.kill();
}
