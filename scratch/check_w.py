import subprocess

cmd = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--disable-gpu',
    '--window-size=360,600',
    '--dump-dom',
    'data:text/html,<script>document.write(window.innerWidth + " x " + window.innerHeight);</script>'
]
out = subprocess.check_output(cmd)
print('CHROME RESULT:', out.decode('utf-8', errors='ignore'))
