<p align="center">
  <img src="Assets/Logo2.png" width="450" alt="Structify Logo">
</p>

<h1 align="center">STRUCTIFY - Make Your DSA Journey Interactive</h1>

[![GitHub license](https://img.shields.io/github/license/structify-app/structify?color=brightgreen&style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

**Structify** is an ultra-interactive, production-grade Data Structures and Algorithms (DSA) learning ecosystem. Built for visual learners, it breaks down abstract programming logic into high-frequency, real-time code mutations, 50+ nested loop visualizations, and features an integrated AST-driven analysis engine that computes complex Big-O metrics instantly.

---

## 🌟 Key Pillars & Features

### 1. High-Frequency Real-time Visualizer
Don't just watch standard slide animations. Structify maps your executing source code ticks directly to dynamic rendering canvases (using specialized reactive pipelines) to display array mutations, linked-list pointer switches, and balancing tree states step-by-step.

### 2. The 50+ Loop Mastery Sandbox
Mastering nested loops is the highest hurdle for computer science newbies. Structify includes 40 to 50 pre-built nested loop program blueprints (diamonds, grids, pyramids, spirals). Tap step-by-step or press play to see outer and inner loop indices synchronize with real-time grid generation.

### 3. AST Complexity Analyzer Engine
Paste your own custom algorithm script straight into the editor. Structify runs the string through an internal **Abstract Syntax Tree (AST)** parser, walks the loops and block scopes, checks call stack depths, and mathematically deduces estimated Time and Space complexity bounds ($O(1)$, $O(\log N)$, $O(N)$, $O(N^2)$).

### 4. Sandboxed Code Runner
A secure multi-tenant execution playground utilizing lightweight client-side WebAssembly containers or ephemeral server workers equipped with active infinity-loop timeouts ($t > 2000\text{ms}$) and host execution escape barriers.

---

## 🎨 Interactive Visual Flow Chart

```
               [ User Pastes Source Code Snippet ]
                               |
                               v
               +-------------------------------+
               |   Secure Execution Sandbox    |
               +---------------+---------------+
                               |
            (Emits State Ticks & Variable Grids)
                               |
                               v
               +-------------------------------+
               |    AST Complexity Engine      | ---> Computes Big-O
               +---------------+---------------+
                               |
                     (AST Node Traversal)
                               |
                               v
         +-------------------------------------------+
         |     High-Performance Animation Canvas     |
         |  (Array / Stack / Tree / Matrix Mutator)  |
         +-------------------------------------------+
```

---

## 🏎️ Getting Started (Local Quickstart)

Follow these steps to spin up Structify in your local development environment:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/structify.git
   cd structify
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development environment:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) to see Structify running live!

---

## 🛠️ Architecture & Core Tech Stack

- **Frontend Core:** React, Vite, TypeScript
- **State Orchestration Layer:** Zustand (High-frequency state synchronization buffering)
- **Parsing Engine:** Acorn / Babel AST Walkers
- **Style Ecosystem:** Tailwind CSS
- **Sanbox Architecture:** WebAssembly/WebContainers for client-side sandboxing

---

## 🤝 Contribution Roadmap

We love our community! Help us expand the ultimate interactive dictionary of computer science.
1. **Fork** the Repository.
2. **Create a Feature Branch** (`git checkout -b feature/amazing-algorithm`).
3. **Commit Your Adjustments** (`git commit -m 'feat: added red-black tree layout visualizer'`).
4. **Push onto the Branch** (`git push origin feature/amazing-algorithm`).
5. Open a formal **Pull Request**.

---
