const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

const PORT = 3000;
const ADMIN_PASS = "admin";
const TMP_CMD_DIR = path.resolve('./.tmp_cmd');
const DIST_DIR = path.resolve('./dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'index.html');

console.log("Cleaning old temporary data...");

[TMP_CMD_DIR, DIST_DIR].forEach(dir => {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
});

let terminalHistory = "--- SYSTEM RESET SUCCESSFUL ---\n";

function buildOS(latestOutput = "") {

    if (latestOutput) {
        terminalHistory += latestOutput
            .replace(/`/g, "\\`")
            .replace(/<\/script>/g, "<\\/script>") + "\n";
    }

    const vfs = {};

    function walk(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const full = path.join(dir, file);
            const rel = path.relative('./', full).replace(/\\/g, '/');

            if (
                rel.startsWith('.tmp') ||
                rel.startsWith('dist') ||
                rel.includes('node_modules') ||
                rel.includes('.git') ||
                rel === 'compile.js'
            ) continue;

            const stats = fs.statSync(full);

            if (stats.isDirectory()) {
                walk(full);
            } else {
                if (rel.match(/\.(js|jsx|ts|tsx|html|css|json)$/) && stats.size < 50000) {
                    vfs[rel] = fs.readFileSync(full).toString('base64');
                }
            }
        }
    }

    walk('./');

    const html = `<!DOCTYPE html>
<html>
<head>
<title>ELGE OS</title>
<style>
body, html { margin:0; padding:0; width:100vw; height:100vh; background:#050505; color:#0f0; font-family:monospace; overflow:hidden; }
#admin-panel { position:fixed; inset:0; background:rgba(0,0,0,0.95); display:none; flex-direction:column; }
#term-out { flex:1; overflow:auto; padding:10px; font-size:12px; white-space:pre-wrap; }
#cmd-in { background:#111; border:1px solid #444; padding:10px; color:#fff; outline:none; }
</style>
</head>
<body>

<div onclick="openAdmin()" 
     style="position:fixed;bottom:10px;right:10px;
            width:60px;height:30px;
            background:#0f0;color:#000;
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;font-weight:bold;">
    ADMIN
</div>

<div id="admin-panel">
<div style="background:#222;padding:10px;">
ADMIN TERMINAL
<button onclick="document.getElementById('admin-panel').style.display='none'">X</button>
</div>
<div id="term-out">${terminalHistory}</div>
<input id="cmd-in" placeholder="Type command...">
</div>

<script>
window.vfs = ${JSON.stringify(vfs)};

function openAdmin() {
    if(prompt("Password:") === "${ADMIN_PASS}") {
        document.getElementById('admin-panel').style.display = 'flex';
    }
}

async function execute(cmd) {
    await fetch('/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, vfs: window.vfs })
    });
    setTimeout(() => location.reload(), 1000);
}

document.getElementById('cmd-in').addEventListener('keypress', e => {
    if (e.key === 'Enter') execute(e.target.value);
});
</script>

</body>
</html>`;

    fs.writeFileSync(OUTPUT_FILE, html);
    console.log("OS Build ready.");
}

function startServer() {

    http.createServer((req, res) => {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            return res.end();
        }

        if (req.method === 'GET' && req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(fs.readFileSync(OUTPUT_FILE));
        }

        if (req.method === 'POST' && req.url === '/exec') {

            let body = '';
            req.on('data', chunk => body += chunk);

            req.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    Object.keys(data.vfs).forEach(p => {
                        const full = path.join(TMP_CMD_DIR, p);
                        fs.mkdirSync(path.dirname(full), { recursive: true });
                        fs.writeFileSync(full, Buffer.from(data.vfs[p], 'base64'));
                    });

                    exec(data.command, { cwd: TMP_CMD_DIR }, (err, stdout, stderr) => {

                        const output = err
                            ? (stderr || err.message)
                            : (stdout || "Done.");

                        buildOS(`$ ${data.command}\n${output}`);

                        res.writeHead(200);
                        res.end("OK");
                    });

                } catch (e) {
                    res.writeHead(500);
                    res.end("Invalid request");
                }
            });

            return;
        }

        res.writeHead(404);
        res.end("Not found");

    }).listen(PORT, () => {
        console.log(`ELGE OS running at http://localhost:${PORT}`);
    });
}

buildOS();
startServer();