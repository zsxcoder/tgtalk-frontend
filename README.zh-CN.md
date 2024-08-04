[English](README.md) | 中文（简体）

## TL;DR

开发中，待完成

## 关于分支

我会使用一些新的工具来构建这个项目，这个分支储存了开发文件，**但是最好不在生产环境使用**

## 关于项目

这是一个使用 [Vue.js](https://vuejs.org/) 和 [Vite](https://vitejs.dev/) 重构的 `TGTalk-Frontend`

同时，本项目的 `umd` 格式文件打包体积与 v1 相比，减少了 ~54% 的包体积

> 在 `TGTalk-Frontend` v2 中，已不再提供 `Markdown` 的渲染支持
> 因为 Telegram 默认会渲染 `Markdown`，但本项目会处理一些 Telegram 的特殊标签

> 在 `TGTalk-Frontend` v2 中，已不再支持自定义模板

## 如何使用

首先，你需要部署 `API`。

你**只需要使用 Cloudflare Worker** 部署它，很简单

第二，你需要在网站上部署前端

你可以使用 CDN 来部署这个项目

```html
<html>
  <head>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    ...
    <!--显示内容的容器-->
    <div id="talk-container"></div>
    <!--为了显着减少包大小，我们没有将 vue 打包，因此您需要显式引用它-->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script>
      const talker = new tgTalker({
        serverUrl: "https://dev-tgtalk.floatsheep.workers.dev/", // API
        selector: "#app", // 显示内容的容器
        zoom: true, // 是否启用图片缩放
      });
      talker.init(); // 在容器中注入 talker
    </script>
  </body>
</html>
```

## 项目依赖

- 前端框架： **Vue.js**
- 构建工具： **Vite**
- 懒加载： **vue3-lazy**
- 类 GitHub 评价：**emaction**
  - 由于 **emaction** 默认前端使用 **Web Components** 技术，考虑到兼容性问题，本项目中将其**转换**为 Vue SFC
    - 仅作 **转换** 并继承 bug
- 图片缩放：**v-viewer**
- 后端 API：在 [ChenYFan](https://github.com/ChenYFan) 大佬基础上进行修改的 **[TGTalk-worker.js](https://gist.github.com/FloatSheep/55db67d9e8148149ebbcb0f9f6b0d901)**
