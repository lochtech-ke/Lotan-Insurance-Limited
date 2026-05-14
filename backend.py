import http.server
import socketserver
import json
import sqlite3
import os
import os
import secrets
import chatbot

import hashlib
import time
import logging

PORT = 8080
DB_FILE = 'lotan_data.db'

# 1. Audit Logging (ISO 27001 Requirement)
logging.basicConfig(
    filename='audit.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# 2. Session Management with Expiry (ISO 27001 Requirement)
# Store tokens as {token: expiry_timestamp}
sessions = {}
SESSION_DURATION = 3600 # 1 hour

# 3. Secure Credential Storage (Simulated ENV/PBKDF2 Hashing)
# In production, this would be loaded from a secure vault or .env
# The hash below is for 'admin' with salt 'somesecuresalt'
ADMIN_SALT = b'somesecuresalt'
ADMIN_HASH = hashlib.pbkdf2_hmac('sha256', b'admin', ADMIN_SALT, 100000)

# 4. IP Rate Limiting (DoS Protection)
rate_limits = {}
MAX_REQUESTS_PER_MINUTE = 60

def check_rate_limit(ip):
    now = time.time()
    if ip not in rate_limits:
        rate_limits[ip] = []
    
    # Clean up old requests
    rate_limits[ip] = [t for t in rate_limits[ip] if now - t < 60]
    
    if len(rate_limits[ip]) >= MAX_REQUESTS_PER_MINUTE:
        logging.warning(f"RATE LIMIT EXCEEDED - IP: {ip}")
        return False
        
    rate_limits[ip].append(now)
    return True

def init_db():
    """Initialize the SQLite database schema."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            company TEXT,
            phone TEXT,
            product TEXT,
            value REAL,
            needs TEXT,
            date_submitted TEXT
        )
    ''')
    conn.commit()
    conn.close()

import html

class APRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for frontend integration
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        
        # ISO 27001 Grade Security Headers
        self.send_header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; frame-ancestors 'none';")
        self.send_header('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
        
        super().end_headers()

    def do_OPTIONS(self):
        """Handle preflight CORS requests."""
        self.send_response(200, "ok")
        self.end_headers()

    def do_POST(self):
        """Handle API POST requests."""
        client_ip = self.client_address[0]
        
        # Enforce Rate Limiting
        if not check_rate_limit(client_ip):
            self.send_response(429)
            self.end_headers()
            self.wfile.write(b'{"error": "Too Many Requests"}')
            return
            
        if self.path == '/api/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # 5. Cryptographic Password Verification
            provided_password = data.get('password', '').encode('utf-8')
            provided_hash = hashlib.pbkdf2_hmac('sha256', provided_password, ADMIN_SALT, 100000)
            
            if secrets.compare_digest(provided_hash, ADMIN_HASH):
                token = secrets.token_hex(32) # Upgraded to 256-bit entropy
                sessions[token] = time.time() + SESSION_DURATION
                logging.info(f"AUDIT - SUCCESSFUL LOGIN - IP: {client_ip}")
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'token': token}).encode('utf-8'))
            else:
                logging.warning(f"AUDIT - FAILED LOGIN ATTEMPT - IP: {client_ip}")
                self.send_response(401)
                self.end_headers()
                
        elif self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            user_query = data.get('query', '')
            bot_response = chatbot.generate_response(user_query)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'response': bot_response}).encode('utf-8'))
            
                
        elif self.path == '/api/leads':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Sanitize inputs to prevent Stored XSS
            def sanitize(val):
                return html.escape(str(val)) if val else ''

            first_name = sanitize(data.get('firstName'))
            last_name = sanitize(data.get('lastName'))
            email = sanitize(data.get('email'))
            company = sanitize(data.get('company'))
            phone = sanitize(data.get('phone'))
            product = sanitize(data.get('product'))
            needs = sanitize(data.get('needs'))
            
            # Basic validation
            try:
                value = float(data.get('value', 0))
            except (ValueError, TypeError):
                value = 0.0

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO leads (first_name, last_name, email, company, phone, product, value, needs, date_submitted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ''', (first_name, last_name, email, company, phone, product, value, needs))
            conn.commit()
            conn.close()
            
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'message': 'Lead submitted successfully.'}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        """Handle API GET requests or fallback to static file serving."""
        client_ip = self.client_address[0]
        
        # Enforce Rate Limiting
        if not check_rate_limit(client_ip):
            self.send_response(429)
            self.end_headers()
            self.wfile.write(b'{"error": "Too Many Requests"}')
            return
            
        if self.path.startswith('/api/leads'):
            # 6. Strict Authentication & Session Timeout Validation
            auth_header = self.headers.get('Authorization')
            is_authorized = False
            
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                if token in sessions and sessions[token] > time.time():
                    is_authorized = True
                    # Extend session on activity
                    sessions[token] = time.time() + SESSION_DURATION
                elif token in sessions:
                    del sessions[token] # Clean up expired session
                    
            if not is_authorized:
                logging.warning(f"AUDIT - UNAUTHORIZED ACCESS ATTEMPT (/api/leads) - IP: {client_ip}")
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b'{"error": "Unauthorized or Session Expired"}')
                return
                
            logging.info(f"AUDIT - SENSITIVE DATA ACCESSED (/api/leads) - IP: {client_ip}")
                
            conn = sqlite3.connect(DB_FILE)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM leads ORDER BY date_submitted DESC')
            leads = [dict(row) for row in cursor.fetchall()]
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(leads).encode('utf-8'))
        else:
            # Fallback to serving the HTML/CSS/JS/Img static files
            super().do_GET()

if __name__ == '__main__':
    init_db()
    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True
    with ReusableTCPServer(("", PORT), APRequestHandler) as httpd:
        print(f"Robust Backend Serving at http://localhost:{PORT}")
        httpd.serve_forever()
