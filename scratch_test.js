const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = 'file:///C:/Users/HP/Downloads/Clinic/index.html';

async function run() {
  const cp = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1024,1200',
    htmlPath
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const pages = await listRes.json();
    const target = pages.find(p => p.url.includes('index.html')) || pages[0];
    if (!target) throw new Error('No page found');

    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const curId = id++;
        callbacks.set(curId, resolve);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    // Set viewport explicitly to 1024px width
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await new Promise(r => setTimeout(r, 1000));

    // Evaluate cards
    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.allergen-season-card');
        return Array.from(cards).map((c, i) => {
          const title = c.querySelector('h5')?.innerText;
          const p = c.querySelector('p.small');
          const pRect = p?.getBoundingClientRect();
          const borderTop = c.querySelector('.border-top');
          const borderRect = borderTop?.getBoundingClientRect();
          const lineHeight = parseFloat(window.getComputedStyle(p).lineHeight);
          const lines = Math.round((pRect?.height || 0) / lineHeight);
          return {
            index: i + 1,
            title,
            text: p?.innerText,
            pHeight: pRect?.height,
            lineHeight,
            approxLines: lines,
            borderTopY: borderRect?.top
          };
        });
      })()`,
      returnByValue: true
    });

    console.log('CARDS INFO AT 1024px:', JSON.stringify(evalResult.result.value, null, 2));

    // Capture screenshot of the seasonality section
    const clipResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('.allergen-season-card').closest('section');
        const rect = section.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 };
      })()`,
      returnByValue: true
    });

    const clip = clipResult.result.value;
    const screenshot = await send('Page.captureScreenshot', {
      clip: { x: clip.x, y: clip.y, width: 1024, height: clip.height, scale: 1 }
    });

    fs.writeFileSync('c:\\Users\\HP\\Downloads\\Clinic\\seasonality_1024.png', Buffer.from(screenshot.result.data, 'base64'));
    console.log('Saved seasonality_1024.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    cp.kill();
  }
}

run();
