// BEUJAYA — minimal zero-dependency Node server
// Serves the cloned login page + gated dashboard, with real session auth.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;

// --- Demo credentials (change via env in production) ---
const USER = process.env.BEUJAYA_USER || 'admin';
const PASS = process.env.BEUJAYA_PASS || 'beujaya2026';

// In-memory sessions (reset on restart). Fine for a demo.
const sessions = new Set();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function send(res, code, body, headers = {}) {
  res.writeHead(code, headers);
  res.end(body);
}

function serveFile(res, filePath, code = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not Found');
    const ext = path.extname(filePath).toLowerCase();
    send(res, code, data, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  });
}

function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie || '';
  raw.split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

function isAuthed(req) {
  const sid = parseCookies(req).sid;
  return sid && sessions.has(sid);
}

function readBody(req, cb) {
  let body = '';
  req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
  req.on('end', () => cb(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  // --- LOGIN ---
  if (req.method === 'POST' && pathname === '/login') {
    return readBody(req, (body) => {
      const form = new URLSearchParams(body);
      const u = (form.get('username') || '').trim();
      const p = form.get('password') || '';
      if (u === USER && p === PASS) {
        const token = crypto.randomBytes(24).toString('hex');
        sessions.add(token);
        return send(res, 302, '', {
          'Set-Cookie': `sid=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`,
          Location: '/dashboard',
        });
      }
      // Wrong credentials → mirror original behaviour
      return send(res, 302, '', { Location: '/?err=1' });
    });
  }

  // --- LOGOUT ---
  if (pathname === '/logout') {
    const sid = parseCookies(req).sid;
    if (sid) sessions.delete(sid);
    return send(res, 302, '', {
      'Set-Cookie': 'sid=; HttpOnly; Path=/; Max-Age=0',
      Location: '/',
    });
  }

  // --- GATED PAGES ---
  if (pathname === '/dashboard' || pathname === '/accounts' || pathname === '/settings') {
    if (!isAuthed(req)) return send(res, 302, '', { Location: '/' });
    const file = pathname === '/dashboard' ? 'dashboard.html'
      : pathname === '/accounts' ? 'accounts.html'
      : 'settings.html';
    return serveFile(res, path.join(ROOT, file));
  }

  // --- Reset password placeholder ---
  if (pathname === '/reset-password') {
    return serveFile(res, path.join(ROOT, 'index.html'));
  }

  // --- Home / login page ---
  if (pathname === '/') {
    return serveFile(res, path.join(ROOT, 'index.html'));
  }

  // --- Static files (block path traversal) ---
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return serveFile(res, path.join(ROOT, 'index.html'), 404);
    serveFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`BEUJAYA running on port ${PORT}`);
  if (!process.env.BEUJAYA_PASS) {
    console.log('⚠ Using default demo credentials — set BEUJAYA_USER / BEUJAYA_PASS env vars in production.');
  }
});
