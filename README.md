# TGTalk-Frontend

English | [中文（简体）](README.zh-CN.md)

## TL;DR

1. **Deploy API**

   - Refer to [API Deployment](API_DEPLOY.zh-CN.md)

2. **Deploy Frontend**

   - Use CDN to deploy the project

   - Include the stylesheet and Vue.js

   - Add a container in the HTML for displaying content

   - Include and initialize `tgTalker`

3. **Example Code**

   ```html
   <html>
     <head>
       <!-- Stylesheet -->
       <link
         rel="stylesheet"
         href="https://registry.npmmirror.com/@floatsheep/tg-talker/latest/files/dist/style.css"
       />
     </head>
     <body>
       ...
       <!-- Container for displaying content -->
       <div id="talk-container"></div>
       <!-- Explicitly include Vue.js -->
       <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
       <script src="https://registry.npmmirror.com/@floatsheep/tg-talker/latest/files/dist/tgTalker.umd.js"></script>
       <script>
         const talker = new tgTalker({
           serverUrl: "https://dev-tgtalk.floatsheep.workers.dev", // API
           selector: "#talk-container", // Container for displaying content
           zoom: true, // Enable image zoom
         });
         talker.init(); // Inject talker into the container
       </script>
     </body>
   </html>
   ```

4. **Configuration**
   - See: [Configuration Details](CONFIG.md)

## Branch Information

This branch stores development files using new tools. **It is not recommended for production use.**

## About the Project

This project is a refactored version of `TGTalk-Frontend` using [Vue.js](https://vuejs.org/) and [Vite](https://vitejs.dev/). The `umd` format file size is reduced by approximately 54% compared to v1.

> In `TGTalk-Frontend` v2, Markdown rendering is no longer supported because Telegram renders Markdown by default, but this project handles some special Telegram tags.
>
> Custom templates are no longer supported in `TGTalk-Frontend` v2. If needed, you can clone this project for customization.

## How to Use

1. **Deploy the API**

   - Refer to [API Deployment](API_DEPLOY.zh-CN.md)

2. **Deploy the Frontend**

   - Use CDN to deploy the project

   - Include the stylesheet and Vue.js

   - Add a container in the HTML for displaying content

   - Include and initialize `tgTalker`

3. **Example Code**

   ```html
   <html>
     <head>
       <!-- Stylesheet -->
       <link
         rel="stylesheet"
         href="https://registry.npmmirror.com/@floatsheep/tg-talker/latest/files/dist/style.css"
       />
     </head>
     <body>
       ...
       <!-- Container for displaying content -->
       <div id="talk-container"></div>
       <!-- Explicitly include Vue.js -->
       <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
       <script src="https://registry.npmmirror.com/@floatsheep/tg-talker/latest/files/dist/tgTalker.umd.js"></script>
       <script>
         const talker = new tgTalker({
           serverUrl: "https://dev-tgtalk.floatsheep.workers.dev", // API
           selector: "#talk-container", // Container for displaying content
           zoom: true, // Enable image zoom
         });
         talker.init(); // Inject talker into the container
       </script>
     </body>
   </html>
   ```

4. **Configuration**
   - See: [Configuration Details](CONFIG.md)

## Project Dependencies

- Frontend Framework: **Vue.js**

- Build Tool: **Vite**

- Lazy Loading: **vue3-lazy**

- GitHub-like Reactions: **emaction**

  - Converted to Vue SFC for compatibility

- Image Zoom: **v-viewer**

- Backend API: Modified version of **[TGTalk-worker.js](https://gist.github.com/FloatSheep/55db67d9e8148149ebbcb0f9f6b0d901)** based on [ChenYFan](https://github.com/ChenYFan)'s work
