import glob

html_files = [f for f in glob.glob('*.html') if not f.startswith('test_') and not f.startswith('debug_')]
for fpath in html_files:
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(fpath, 'r', encoding='latin-1') as f:
            content = f.read()
            
    if 'd-none d-sm-inline-flex' in content:
        content = content.replace('d-none d-sm-inline-flex', 'd-inline-flex align-items-center')
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated:', fpath)
