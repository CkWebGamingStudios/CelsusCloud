const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

const PORT = 3000;
const ADMIN_PASS = "admin";
const DIST_DIR = path.resolve('./dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'index.html');

// Create dist if it doesn't exist so the server has something to show
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_FILE)) fs.writeFileSync(OUTPUT_FILE, "<h1>System Initializing... Please refresh in 5 seconds.</h1>");

let terminalHistory = "--- ELGE OS BOOT LOG ---\n";

function buildOS(latestOutput = "") {
    console.log("🔨 Rebuilding UI...");
    if (latestOutput) terminalHistory += latestOutput + "\n";

    const vfs = {};
    const walk = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const full = path.join(dir, file);
            const rel = path.relative('./', full).replace(/\\/g, '/');
            
            if (rel.startsWith('.') || rel.startsWith('node_modules') || rel.startsWith('dist')) continue;

            const stats = fs.statSync(full);
            if (stats.isDirectory()) walk(full);
            else if (rel.match(/\.(js|jsx|html|css|json)$/) && stats.size < 50000) {
                console.log(`  > Bundling: ${rel}`);
                vfs[rel] = fs.readFileSync(full).toString('base64');
            }
        }
    };
    
    try {
        walk('./');
        const html = `<!DOCTYPE html>
        <html>
        <head><title>ELGE OS</title><style>body{background:#000;color:#0f0;font-family:monospace;margin:0;}iframe{width:100%;height:100vh;border:none;background:#fff;}</style></head>
        <body>
            <iframe id="vp" src="about:blank"></iframe>
            <div id="admin" style="position:fixed;bottom:10px;right:10px;width:20px;height:20px;cursor:pointer;" onclick="login()"></div>
            <div id="panel" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);flex-direction:column;padding:20px;">
                <pre style="flex-grow:1;overflow:auto;border:1px solid #333;padding:10px;">${terminalHistory.replace(/`/g, "'")}</pre>
                <input id="in" style="width:100%;background:#111;color:#fff;border:1px solid #0f0;padding:10px;" placeholder="Type command...">
            </div>
            <script>
                window.vfs = ${JSON.stringify(vfs)};
                function login(){ if(prompt("Pass:")==="${ADMIN_PASS}") document.getElementById('panel').style.display='flex'; }
                document.getElementById('in').onkeypress = async (e) => {
                    if(e.key === 'Enter'){
                        const cmd = e.target.value;
                        await fetch('/exec', {method:'POST', body: JSON.stringify({command:cmd, vfs:window.vfs})});
                        setTimeout(()=>location.reload(), 1000);
                    }
                }
            </script>
        </body></html>`;
        fs.writeFileSync(OUTPUT_FILE, html);
        console.log("✅ UI Ready.");
    } catch (e) { console.error("❌ Build Error:", e); }
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'POST' && req.url === '/exec') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const data = JSON.parse(body);
            exec(data.command, (err, stdout, stderr) => {
                buildOS("$ " + data.command + "\n" + (stdout || stderr));
                res.end("ok");
            });
        });
        return;
    }

    const target = req.url === '/' ? '/index.html' : req.url;
    const file = path.join(DIST_DIR, target);
    
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200);
        fs.createReadStream(file).pipe(res);
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 SERVER RUNNING AT: http://localhost:${PORT}`);
    console.log(`👉 Open that link in your browser now!`);
    buildOS(); 
});
