import re

# Test index.html with open menu
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

index_open = index_html.replace('class="collapse navbar-collapse"', 'class="collapse navbar-collapse show"')
with open('test_final_index_open.html', 'w', encoding='utf-8') as f:
    f.write(index_open)

# Test about.html with open menu
with open('about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

about_open = about_html.replace('class="collapse navbar-collapse"', 'class="collapse navbar-collapse show"')
with open('test_final_about_open.html', 'w', encoding='utf-8') as f:
    f.write(about_open)

print('Generated test_final_index_open.html and test_final_about_open.html')
