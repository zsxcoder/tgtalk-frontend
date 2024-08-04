English | [中文（简体）](README.zh-CN.md)

## About the branch

I will use some new tools to build this project.

The branch saves my file, **And it cannot be used in a production environment.**

## About the project

This is a project using [Vue.js](https://vuejs.org/) and [Vite](https://vitejs.dev/) to build.

It's a remastered version of tgtalk-frontend.

## How to use

First, you need to deploy the backend server.

Oh, don't be worried. You should only use Cloudflare Worker to deploy it in a simple way.

Second, you need to deploy the frontend on your website.

You can use the project with a CDN. And this is a test for the way following.

```html
<html>
  <head>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    ...
    <!--This is a container to display the content-->
    <div id="talk-container"></div>
    <!--We use vue and To significantly reduce the package size, we didn't package it, so you need to explicitly reference it-->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script>
      const talker = new tgTalker({
        serverUrl: "https://dev-tgtalk.floatsheep.workers.dev/", // The backend server address
        selector: "#app", // The container to display the content
        zoom: true, // Whether to enable zoom
      });
      talker.init(); // Inject the talker
    </script>
  </body>
</html>
```
