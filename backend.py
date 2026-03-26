import http.server
import socketserver
import json
import sqlite3
import os
import os
import secrets
import chatbot

PORT = 8080
DB_FILE = 'lotan_data.db'

# Simple in-memory session store for admin tokens
sessions = set()

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

class APRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for frontend integration
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle preflight CORS requests."""
        self.send_response(200, "ok")
        self.end_headers()

    def do_POST(self):
        """Handle API POST requests."""
        if self.path == '/api/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Simple admin validation (In production, use hashed passwords from DB)
            if data.get('password') == 'admin':
                token = secrets.token_hex(16)
                sessions.add(token)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'token': token}).encode('utf-8'))
            else:
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
            
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO leads (first_name, last_name, email, company, phone, product, value, needs, date_submitted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ''', (
                data.get('firstName'),
                data.get('lastName'),
                data.get('email'),
                data.get('company'),
                data.get('phone'),
                data.get('product'),
                data.get('value'),
                data.get('needs')
            ))
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
        if self.path.startswith('/api/leads'):
            # Admin Authentication Check
            auth_header = self.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer ') or auth_header.split(' ')[1] not in sessions:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b'{"error": "Unauthorized"}')
                return
                
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
