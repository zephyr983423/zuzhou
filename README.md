# Le Carnet des Malédictions (诅咒笔记)

Un site web sombre et mystérieux où les utilisateurs peuvent inscrire des malédictions anonymes.

## 技术栈 / Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Style**: Tailwind CSS (thème gothique sombre)
- **Base de données**: Vercel KV (Upstash Redis)
- **Déploiement**: Vercel
- **Langue**: Français

## 功能 / Fonctionnalités

- 无需注册即可使用 / Aucune inscription requise
- 写下讨厌的人的名字和诅咒 / Inscrire un nom et une malédiction
- 被诅咒排行榜 / Classement des personnes les plus maudites
- 点击名字查看所有诅咒 / Cliquer sur un nom pour voir toutes les malédictions
- 实时更新 / Mise à jour en temps réel (15s)
- 响应式设计 / Design responsive (mobile + desktop)

## 本地开发 / Développement Local

### 1. 安装依赖 / Installer les dépendances

```bash
npm install
```

### 2. 配置环境变量 / Configurer les variables d'environnement

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

然后填入 Vercel KV 的凭据（见下方 Vercel 部署步骤）。

### 3. 启动开发服务器 / Démarrer le serveur de développement

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel / Déploiement sur Vercel

### 步骤 1: 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit - Le Carnet des Malédictions"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 步骤 2: 在 Vercel 导入项目

1. 登录 [vercel.com](https://vercel.com)
2. 点击 **"Add New" → "Project"**
3. 导入你的 GitHub 仓库
4. Framework Preset 选择 **Next.js**
5. 点击 **Deploy**

### 步骤 3: 创建 Vercel KV Store

1. 在 Vercel Dashboard 中进入你的项目
2. 点击 **"Storage"** 标签页
3. 点击 **"Create Database"**
4. 选择 **"KV"** (Upstash Redis)
5. 选择一个区域（建议选择离你用户最近的）
6. 点击 **"Create"**
7. 环境变量会自动添加到你的项目中

### 步骤 4: 重新部署

创建 KV Store 后需要重新部署以使环境变量生效：

1. 进入 **"Deployments"** 标签页
2. 点击最新部署旁的 **"..."**
3. 选择 **"Redeploy"**

## 项目结构 / Structure du Projet

```
unsite/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── curses/route.ts      # API: 添加/获取诅咒
│   │   │   └── leaderboard/route.ts  # API: 排行榜
│   │   ├── components/
│   │   │   ├── CurseForm.tsx         # 诅咒表单组件
│   │   │   ├── CurseCard.tsx         # 诅咒卡片组件
│   │   │   ├── Leaderboard.tsx       # 排行榜组件
│   │   │   └── TargetModal.tsx       # 目标详情弹窗
│   │   ├── globals.css               # 全局样式
│   │   ├── layout.tsx                # 根布局
│   │   └── page.tsx                  # 首页
│   └── lib/
│       └── store.ts                  # 数据存储层 (Vercel KV)
├── .env.local.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
