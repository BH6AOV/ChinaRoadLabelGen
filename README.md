# 中国道路标识生成工具 | China Road Label Generator

[![License: EPL-2.0](https://img.shields.io/badge/License-EPL--2.0-orange.svg)](https://opensource.org/licenses/EPL-2.0)
![Vibe Coding](https://img.shields.io/badge/Style-Vibe%20Coding-blueviolet)

> **⚠ 本项目使用 AI 辅助实现代码编写 (This program use Vibe Coding).**

## 📖 项目简介 / Introduction

本项目其实只是本人出门拍公路 POV 每次找道路标识都很麻烦，所以实在是受不了了决定自己造轮子的产物。
This project was born out of my own frustration. As a Highway POV creator, finding accurate road labels was always a hassle, so I decided to build my own solution.

在本仓库创建前，已经通过 **Vibe Coding** 实现了一个不是很好用的 Python 版本，但是由于实在是不好用且不方便，决定现在重新开一个仓库重构整个轮子到 Web 端，以后可能会打包成一个 Electron 程序也说不定。
Before this repository, I implemented a rather clunky Python version via **Vibe Coding**. Since it was inconvenient to use, I decided to start this new repo to refactor the entire tool for the Web. I might even package it as an Electron app in the future.

---

## ✨ 主要功能 / Features

* [x] **高度自定义 / Highly Customizable**: 支持路名、编号、距离等信息的实时修改。 (Supports real-time editing of road names, numbers, and distances.)
* [x] **标准配色 / Standard Palettes**: 内置高速绿、国道红、省道黄等标准色板。 (Built-in standard color palettes for Expressways, National Highways, and Provincial Roads.)
* [x] **即时预览 / Live Preview**: 所见即所得，通过 Canvas 实现高清晰度渲染。 (WYSIWYG rendering via Canvas API.)
* [x] **一键导出 / Easy Export**: 支持导出图片格式，方便直接拖入剪辑软件。 (Export as images for direct use in video editing software.)

---

## 🛠 技术栈 / Tech Stack

* **Frontend**: HTML5 / CSS3 / JavaScript
* **Graphics**: Canvas API
* **Methodology**: **Vibe Coding** (Powered by AI)

---

## 🚀 快速开始 / Quick Start

1. **克隆仓库 / Clone the Repo**
   ```bash
   git clone [https://github.com/YourUsername/China-Road-Label-Generator.git](https://github.com/YourUsername/China-Road-Label-Generator.git)
运行项目 / Run it
由于本项目目前为纯前端实现，您只需要在浏览器中打开 index.html 即可使用。
Since this is a pure frontend project, simply open index.html in your browser.

## 📅 开发计划 / Roadmap
* [ ] 完善更多路牌模板 / More sign templates (Warning signs, directional signs, etc.)

* [ ] 优化标准路牌字体的匹配 / Optimize font matching for GB standards.

* [ ] 使用 Electron 封装为桌面应用 / Package as a desktop app via Electron.

## ⚖️ 许可证 / License
本项目采用 EPL-2.0 (Eclipse Public License 2.0) 协议开源。
This project is licensed under the EPL-2.0.

## 🤝 贡献与反馈 / Contributing & Feedback
如果你也是 POV 爱好者，或者对道路标识有独特的审美追求，欢迎提交 Pull Request 或 Issue。
If you're a POV enthusiast or care about the aesthetics of road signs, feel free to submit a PR or Issue.

请注意，本项目遵循 Vibe Coding 哲学，代码逻辑可能包含大量 AI 辅助生成的痕迹。
Please note that this project follows the Vibe Coding philosophy; the codebase may contain significant AI-generated logic.

祝你的公路旅行和视频创作顺利！🛣️
Happy road trips and video creating!