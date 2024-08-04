在 `TGTalk-Frontend` v2 中，我们变更了部分东西，本文档可以帮助你更好地配置 `TGTalk-Frontend`。

## 基础配置

你在 `script` 中会通过一个构造函数 `tgTalker` 来创建 `tgTalker` 实例。

这时，你会传入一个配置对象，其基本格式大致如下：

```javascript
new tgTalker({
  serverUrl: "",
  selector: "",
  zoom: false,
})
```

**必选**：

- `serverUrl` 是一个字符串（String），你需要在其中传入 API 地址（**注意，末尾不需要加 `/`**）。
- `selector` 是一个字符串（String），你需要在其中传入一个元素选择器。

假设你的 HTML 结构如下：

```html
<html>
    <head>
        ...
    </head>
    <body>
        <div class="talk-container"></div>
    </body>
</html>
```

你希望 `tgTalker` 在类名为 `talk-container` 的容器中生成，你就可以将 `selector` 配置为 `.talk-container`。

如果是一个 `id`，则 `selector` 配置为 `#容器 ID 名`。

## 额外配置

除了基础配置，你还可以添加额外配置来拓展功能。

额外功能的所有配置对象如下：

```javascript
new tgTalker({
    ...
    zoom: false,
    custom: {
      proxy: {
        proxyUrl: "",
        image: false,
      },
    emaction: {
      enable: false,
      endpoint: "",
      theme: "",
      availableArrayString: "",
      threeDimensional: false,
    },
  },
})
```

- `zoom` 是一个布尔值（Boolean），你可以选择为 `true` 或 `false` 来启用图片放大功能。
- `custom` 是一个配置对象（Object），你需要在其中写入其他配置。

  **必须注意的是，如果你不想启用 `custom` 下的所有功能，你必须从配置中删除 `custom` 对象**。

  - `proxy` 是一个配置对象（Object），你可以在其中配置代理。

    - `proxyUrl` 是一个字符串（String），你可以在其中配置图片代理服务器（**此配置项的末尾不能出现 `/`**）。
    - `image` 是一个布尔值（Boolean），你可以选择为 `true` 或 `false` 来启用图片代理功能，当此为 `false` 时，`proxyUrl` 配置不生效。

  - `emaction` 是一个配置对象（Object），你可以在其中配置 `emaction` 相关配置。

    - `enable` 是一个布尔值（Boolean），你可以选择为 `true` 或 `false` 来启用评价功能，当此为 `false` 时，下列配置不生效。

    - `endpoint` 是一个字符串（String），你可以配置 `emaction` 的 API 地址（**此配置项的末尾不能出现 `/`**）。

    - `theme` 是一个字符串（String），你可以选择为 `system`、`dark`、`light` 或留空，缺省值为 `system`，你可以配置 `emaction` 的主题。

    - `availableArrayString` 是一个字符串（String），你可以配置 `emaction` 的 emoji 列表，留空时为默认列表（`👍,thumbs-up;😄,smile-face;🎉,party-popper;😕,confused-face;❤️,red-heart;🚀,rocket;👀,eyes;`），具体配置可以查看 [emaction/emaction.frontend - 进阶配置][1]。

    - `threeDimensional` 是一个布尔值（Boolean），你可以选择为 `true` 或 `false` 来启用 3D Emoji 功能，当选择为 `true` 后，**会引入一个自定义字体，并可能引发 CSP 问题和版权问题**，此逻辑将会在 `2.0.0-alpha2` 中更改。

**注：在本项目中，`emaction` 的 `reactTargetId` 被标记为 `channelData.id`，如果多人使用一个 `emaction` API，且同时使用本项目，可能会引发评价信息冲突。**

[1]: https://github.com/emaction/emaction.frontend?tab=readme-ov-file
