import urllib.request
import json
import sqlite3
import re

base = 'http://localhost:8080'
pages = ['/', '/index.html', '/about.html', '/products.html']

print('=== PAGE AVAILABILITY ===')
for page in pages:
    try:
        r = urllib.request.urlopen(base + page, timeout=5)
        content = r.read().decode('utf-8')
        print(f'  {page}: {r.status} OK  ({len(content)} bytes)')
    except Exception as e:
        print(f'  {page}: FAIL - {e}')

print()
print('=== CRITICAL CONTENT CHECKS ===')

# Check home page - regulatory credentials removed
try:
    r = urllib.request.urlopen(base + '/index.html', timeout=5)
    html = r.read().decode('utf-8')
    checks = [
        ('Regulatory & Legal Credentials REMOVED', 'Regulatory &amp; Legal Credentials' not in html and 'Regulatory & Legal Credentials' not in html),
        ('IRA license number removed from footer', 'IRA/05/26054/2026' not in html),
        ('PVT-86RI2EL removed from footer', 'PVT-86RI2EL' not in html),
        ('Navbar has Home link', 'href="index.html"' in html or "href='index.html'" in html),
        ('Navbar has About Us link', 'about.html' in html),
        ('Navbar has Products link', 'products.html' in html),
        ('Unlock Capital CTA present', 'Unlock Capital' in html),
        ('Contact form present', 'pipeline-form' in html or 'id="firstName"' in html),
        ('Hero section present', 'hero' in html),
    ]
    print('  --- index.html ---')
    for label, result in checks:
        icon = 'PASS' if result else 'FAIL'
        print(f'    [{icon}] {label}')
except Exception as e:
    print(f'  index.html read FAILED: {e}')

print()
try:
    r = urllib.request.urlopen(base + '/about.html', timeout=5)
    html = r.read().decode('utf-8')
    checks = [
        ('Regulatory Credentials section REMOVED', 'Regulatory Credentials' not in html),
        ('IRA license number removed from footer', 'IRA/05/26054/2026' not in html),
        ('PVT-86RI2EL removed from footer', 'PVT-86RI2EL' not in html),
        ('Who We Are section present', 'Who We Are' in html),
        ('Lotan Advantage section present', 'Lotan Advantage' in html),
        ('CTA present', 'Unlock Your Capital' in html),
        ('Navbar present', '<nav>' in html),
    ]
    print('  --- about.html ---')
    for label, result in checks:
        icon = 'PASS' if result else 'FAIL'
        print(f'    [{icon}] {label}')
except Exception as e:
    print(f'  about.html read FAILED: {e}')

print()
try:
    r = urllib.request.urlopen(base + '/products.html', timeout=5)
    html = r.read().decode('utf-8')
    checks = [
        ('Products page loads', len(html) > 1000),
        ('Navbar present', '<nav>' in html),
        ('Has product content', 'product' in html.lower()),
    ]
    print('  --- products.html ---')
    for label, result in checks:
        icon = 'PASS' if result else 'FAIL'
        print(f'    [{icon}] {label}')
except Exception as e:
    print(f'  products.html read FAILED: {e}')

print()
print('=== FORM SUBMISSION TEST (POST /api/leads) ===')
payload = json.dumps({
    'firstName': 'Test',
    'lastName': 'User',
    'email': 'test@example.com',
    'company': 'Test Corp',
    'phone': '+254 700 000 001',
    'product': 'Unlocking Lending Capacity',
    'value': 1000000,
    'needs': 'Automated e2e test submission'
}).encode()
req = urllib.request.Request(
    base + '/api/leads',
    data=payload,
    headers={'Content-Type': 'application/json'},
    method='POST'
)
try:
    r = urllib.request.urlopen(req, timeout=5)
    body = r.read().decode()
    print(f'  Status: {r.status}')
    print(f'  Response: {body}')
except Exception as e:
    print(f'  FAIL: {e}')

print()
print('=== DATABASE VERIFICATION (last 3 leads) ===')
try:
    conn = sqlite3.connect('lotan_data.db')
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        'SELECT id, first_name, last_name, email, company, product, date_submitted FROM leads ORDER BY id DESC LIMIT 3'
    ).fetchall()
    for row in rows:
        print(f'  {dict(row)}')
    conn.close()
except Exception as e:
    print(f'  DB read FAILED: {e}')

print()
print('=== TEST COMPLETE ===')
