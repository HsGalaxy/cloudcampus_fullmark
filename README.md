# Cloudcampus H5P Helper

为了让大一学弟学妹们免受 Cloudcampus（CC）作业劳神费力之折磨，特此开源我于大一期间编写的 CC 满分辅助工具。

本工具通过拦截并动态修正 H5P 组件的提交数据，实现**自动化满分提交**。启用后，你只需保持工具运行并直接提交（哪怕交白卷），系统也会自动将其 Patch 为满分状态。

---

## ✨ 核心功能

* **自动分数修正**：捕获提交请求，自动将 `raw score` 变更为 `max score`，`scaled score` 修正为 `1`。
* **状态全自动化**：自动标记作业状态为 `completion`（完成）与 `success`（成功）。
* **智能模拟时长**：随机伪造 40 ~ 160 秒的合理答题时间，规避因“秒交”导致的后台异常行为。
* **可视化状态栏**：页面右下角内置原生感知状态栏，实时显示“拦截-伪造-提交”全生命周期状态，无需打开控制台。

---

## 🚀 简易使用指南

本工具基于 **Tampermonkey（油猴）** 插件运行，请按照以下步骤配置：

### 1. 安装油猴插件
在你的浏览器（Chrome / Edge / Firefox 等）中安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。

### 2. 新建用户脚本
点击浏览器右上角的 Tampermonkey 图标，选择 **“添加新脚本”**。

### 3. 粘贴并保存脚本
清空编辑器中的默认代码，将下方的**完整源代码**复制进去，保存（`Ctrl + S` 或 `Cmd + S`）即可。

---

## 📄 [完整源代码](https://raw.githubusercontent.com/HsGalaxy/cloudcampus_fullmark/refs/heads/main/cloudcampus.js)
