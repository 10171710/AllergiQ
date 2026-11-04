import subprocess, time, json, urllib.request

proc = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    'about:blank'
])
time.sleep(1.5)

try:
    resp = urllib.request.urlopen('http://localhost:9222/json').read()
    tabs = json.loads(resp)
    ws_url = tabs[0]['webSocketDebuggerUrl']
    print('Tabs:', len(tabs), ws_url)
finally:
    proc.terminate()
