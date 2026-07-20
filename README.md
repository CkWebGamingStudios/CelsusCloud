# Celsus 🚀  
### Next-Gen Documentation Framework for Modern Developers  

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)  
![npm](https://img.shields.io/badge/npm-v9.0.0+-red.svg)  
![Status](https://img.shields.io/badge/status-active-success.svg)

---

## 🌍 Overview  

**Celsus** is a next-generation documentation framework built for developers who value **speed, automation, and flexibility**. It eliminates repetitive setup tasks, allowing teams to focus on writing, not configuring.  
With built-in CLI tools, instant preview servers, and seamless deployment integrations, Celsus makes managing docs for any project effortless.

---

## ✨ Features  

- ⚡ **Lightning-Fast Builds** — Optimized static site generation with caching and live reload.  
- 🧠 **Smart CLI** — Intuitive commands: `celsus create`, `celsus build`, `celsus deploy`, `celsus console`.  
- 🪶 **Zero Config Setup** — Works right out of the box; no complex setup required.  
- 🌈 **Theming Support** — Customizable themes with color modes and layouts.  
- 🔌 **Plugin System** — Extend functionality with modular plugins.  
- 📜 **Markdown & MDX Ready** — Write docs using Markdown or interactive MDX.  
- 🌐 **One-Command Deployments** — Built-in GitHub Pages, Cloudflare, and Netlify deploy support.  
- 🧩 **Developer Friendly** — TypeScript-ready architecture and simple config files.  

---

## 🧰 Installation  

Install Celsus globally using **npm** or **yarn**:

```bash
# Using npm
npm install -g celsus
```

```bash
# Using yarn
yarn global add celsus
```

---

## 🚀 Getting Started  

### 1️⃣ Create a New Documentation Project

```bash
celsus create my-docs
cd my-docs
npm start
```

The local dev server automatically finds a free port (default: `3000`) and launches instantly.

### 2️⃣ Build for Production

```bash
celsus build
```

Your site will be compiled into a static bundle optimized for performance.

### 3️⃣ Deploy Your Site

```bash
celsus deploy
```

Supports **GitHub Pages**, **Cloudflare Pages**, **Netlify**, and **Vercel**.

---

## ⚙️ Configuration  

You can customize your setup by creating a `celsus.config.js` file:

```js
export default {
  title: "Celsus Documentation",
  description: "Next-gen documentation framework",
  theme: "modern",
  port: 3000,
  favicon: "./public/favicon.ico",
  plugins: ["search", "analytics", "sitemap"],
  baseURL: "https://yourdomain.com/docs",
};
```

---

## 📁 Project Structure  

```
my-docs/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── pages/
│   ├── components/
│   └── main.js
├── celsus.config.js
└── package.json
```

---

## 🧑‍💻 Development Commands  

| Command | Description |
|----------|-------------|
| `celsus create <name>` | Create a new documentation project |
| `celsus dev` | Start local dev server with hot reload |
| `celsus build` | Build production-ready site |
| `celsus deploy` | Deploy site to chosen platform |
| `celsus console` | Access the internal CLI console |
| `celsus demo` | Generate sample documentation project |

---

## 🧩 Plugin System  

Plugins allow you to extend Celsus with extra capabilities.  

Example plugin config:

```js
plugins: [
  "search",
  ["analytics", { provider: "Google", id: "UA-123456" }],
  ["sitemap", { priority: 0.8 }]
]
```

Available plugins:
- 🔍 `search` — Adds in-site search  
- 📊 `analytics` — Adds Google/Cloudflare Analytics  
- 🗺️ `sitemap` — Auto-generates sitemap.xml  

---

## 🌈 Theming  

Themes are located under `src/theme/`.  
To create a custom theme:

```bash
celsus theme create my-theme
```

Then edit your configuration:

```js
theme: "my-theme"
```

Celsus supports **light/dark modes**, typography customization, and accent colors.

---

## ☁️ Supported Deployment Platforms  

- 🌐 **GitHub Pages** — via `gh-pages` branch  
- ☁️ **Cloudflare Pages** — automatic deploy via CLI  
- 🌍 **Netlify** — easy deploy with `netlify-cli`  
- ⚙️ **Vercel** — one-click deployment  

---

## 🧠 Troubleshooting  

| Problem | Solution |
|----------|-----------|
| Port already in use | Celsus auto-selects a new port |
| Build fails | Delete `.cache` folder and rebuild |
| CLI not found | Ensure Node.js ≥16 and reinstall globally |
| Theme not loading | Check `celsus.config.js` theme path |

---

## 🧭 Roadmap  

- [x] CLI core commands  
- [x] Plugin system  
- [x] GitHub + Cloudflare deployment  
- [ ] Live collaboration mode  
- [ ] Custom analytics dashboard  
- [ ] AI-powered doc generation  

---

## 🤝 Contributing  

We welcome contributions!  

1. Fork the repository  
2. Create a new branch (`feature/my-feature`)  
3. Commit your changes  
4. Open a Pull Request  

Run the dev build before submitting:  

```bash
npm run dev
```

---

## 🧩 Tech Stack  

- ⚛️ React + Vite  
- 🧱 Node.js + TypeScript  
- 📝 MDX + Markdown Parser  
- 💅 TailwindCSS + ShadCN UI  
- ⚙️ ESM-first modular structure  

---

## 📜 License  

Celsus is licensed under the **MIT License** — free for personal and commercial use.  

---

## 👨‍💻 Author  

Developed with ❤️ by **CK Web Gaming**  
GitHub: [@CKWebGaming](https://github.com/CKWebGaming)

---

## 🌟 Acknowledgements  

Special thanks to open-source tools and contributors who made Celsus possible:
- Node.js
- React
- TailwindCSS
- MDX
- The developer community ❤️
