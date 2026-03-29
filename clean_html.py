import re

files = ["d:/Projects/Lotan-Insurance-Limited/index.html", "d:/Projects/Lotan-Insurance-Limited/about.html", "d:/Projects/Lotan-Insurance-Limited/products.html"]

for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Remove the page-specific <style> block completely
    content = re.sub(r'<style>.*?</style>', '<!-- Styles moved to css/main.css -->', content, flags=re.DOTALL)
    
    # Replace header classes
    content = content.replace('class="about-header"', 'class="page-header-dark"')
    content = content.replace('class="products-header"', 'class="page-header-dark"')
    
    # Replace links
    content = content.replace('"index.html"', '"/"')
    content = content.replace('"about.html"', '"/about"')
    content = content.replace('"products.html"', '"/products"')
    
    with open(f, "w", encoding="utf-8") as file:
        file.write(content)

print("Cleaned up HTML files.")
