import urllib.request
import json
import os
import re

# Next.js dev/prod default; set PORT=8080 for legacy python backend
PORT = int(os.environ.get('PORT', '3000'))
base = f'http://localhost:{PORT}'

pages = [
    '/',
    '/about',
    '/products',
    '/contact',
    '/insights',
    '/case-studies',
    '/executive-advisory',
    '/partnerships',
    '/standards',
]

print('=== PAGE AVAILABILITY ===')
for page in pages:
    try:
        r = urllib.request.urlopen(base + page, timeout=10)
        content = r.read().decode('utf-8')
        print(f'  {page}: {r.status} OK  ({len(content)} bytes)')
    except Exception as e:
        print(f'  {page}: FAIL - {e}')

print()
print('=== CRITICAL CONTENT CHECKS ===')

try:
    r = urllib.request.urlopen(base + '/', timeout=10)
    html = r.read().decode('utf-8')
    checks = [
        ('IRA license number in page', 'IRA/05/26054/2026' in html),
        ('Old IRA license removed', 'IRA/001/BR/2015' not in html),
        ('PVT-86RI2EL removed', 'PVT-86RI2EL' not in html),
        ('Navbar has Home link', 'href="/"' in html or "href='/'" in html),
        ('Navbar has About link', '/about' in html),
        ('Solutions section present', 'solutions' in html.lower() or '/products' in html),
        ('Get a Quote CTA present', 'Get a Quote' in html),
        ('Contact form present', 'pipeline-form' in html),
    ]
    print('  --- home ---')
    for label, result in checks:
        icon = 'PASS' if result else 'FAIL'
        print(f'    [{icon}] {label}')
except Exception as e:
    print(f'  home read FAILED: {e}')

print()
try:
    r = urllib.request.urlopen(base + '/about', timeout=10)
    html = r.read().decode('utf-8')
    checks = [
        ('Regulatory section present', 'Regulatory' in html and 'Compliance' in html),
        ('IRA license in page', 'IRA/05/26054/2026' in html),
        ('Core Values present', 'Our Core Values' in html),
        ('Get a Quote CTA', 'Get a Quote' in html),
    ]
    print('  --- about ---')
    for label, result in checks:
        icon = 'PASS' if result else 'FAIL'
        print(f'    [{icon}] {label}')
except Exception as e:
    print(f'  about read FAILED: {e}')

print()
try:
    r = urllib.request.urlopen(base + '/contact', timeout=10)
    html = r.read().decode('utf-8')
    checks = [
        ('Contact page loads', len(html) > 1000),
        ('pipeline-form on contact', 'pipeline-form' in html),
        ('IRA licence on contact', 'IRA/05/26054/2026' in html),
    ]
    print('  --- contact ---')
    for label, result in checks:
        icon = 'PASS' if result else 'FAIL'
        print(f'    [{icon}] {label}')
except Exception as e:
    print(f'  contact read FAILED: {e}')

print()
print('=== FORM SUBMISSION TEST (POST /api/leads) ===')
payload = json.dumps({
    'firstName': 'Test',
    'lastName': 'User',
    'email': 'test@example.com',
    'company': 'Test Corp',
    'phone': '+254 700 000 001',
    'product': 'Credit Protection Policy',
    'value': 1000,
    'needs': 'Automated e2e test submission'
}).encode()
req = urllib.request.Request(
    base + '/api/leads',
    data=payload,
    headers={'Content-Type': 'application/json'},
    method='POST'
)
try:
    r = urllib.request.urlopen(req, timeout=10)
    body = r.read().decode()
    print(f'  Status: {r.status}')
    print(f'  Response: {body}')
except Exception as e:
    print(f'  FAIL: {e}')

print()
print('=== TEST COMPLETE ===')
