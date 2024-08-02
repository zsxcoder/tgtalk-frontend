import { ref, onMounted, resolveComponent, resolveDirective, openBlock, createElementBlock, Fragment, renderList, createElementVNode, toDisplayString, createBlock, withDirectives, createCommentVNode, withCtx } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import imageZoom from "./components/imageZoom.vue";
const _hoisted_1 = {
  key: 0,
  id: "talk-wrapper"
};
const _hoisted_2 = ["id"];
const _hoisted_3 = { class: "talk-id" };
const _hoisted_4 = ["innerHTML"];
const _hoisted_5 = { class: "talk-img-list" };
const _hoisted_6 = { key: 1 };
const _hoisted_7 = { class: "talk-time" };
const _hoisted_8 = { key: 1 };
const _hoisted_9 = ["innerHTML"];
const _sfc_main = {
  __name: "App",
  props: {
    config: Object
  },
  setup(__props) {
    const props = __props;
    const talkConfig = {
      serverUrl: props.config.serverUrl || "",
      selector: props.config.selector,
      zoom: props.config.zoom || false,
      custom: props.config.custom || {
        proxy: {
          image: false
        }
      }
    };
    const loadLyrics = [
      "Chipi，",
      "chipi，",
      "chapa，",
      "chapa\n",
      "Dubi，",
      "dubi，",
      "daba，",
      "daba\n",
      "Mágico，",
      "mi，",
      "dubi，",
      "dubi\n",
      "boom，",
      "boom，",
      "boom，",
      "boom\n",
      "Chipi，",
      "chipi，",
      "chapa，",
      "chapa\n",
      "Dubi，",
      "dubi，",
      "daba，",
      "daba\n",
      "Mágico，",
      "mi，",
      "dubi，",
      "dubi\n",
      "booooooooooooooom\n"
    ];
    let chip = 0;
    const nowChip = ref("");
    setInterval(() => {
      nowChip.value += loadLyrics[chip].replace(/\n/g, "<br>");
      chip++;
      if (chip >= loadLyrics.length) chip = 0;
    }, 400);
    const talkData = ref(null);
    const error = ref(null);
    const nextBefore = ref(null);
    marked.use({
      gfm: true,
      breaks: false
    });
    const fetchData = async (isNext) => {
      try {
        let response;
        isNext ? response = await fetch(
          `${talkConfig.serverUrl}/?startbefore=${nextBefore.value}`
        ) : response = await fetch(talkConfig.serverUrl);
        const data = await response.json();
        nextBefore.value = data.nextBefore;
        data.ChannelMessageData.map((e) => {
          e.text = DOMPurify.sanitize(marked.parse(e.text)).replace(
            /<a[^>]*?(#SFCN|href="[^"]*SFCN[^"]*")[^>]*>.*?<\/a>/gi,
            ""
          );
          e.image = e.image.map((imgTag) => {
            let returnTag = talkConfig.custom.proxy.image ? imgTag.replace(
              /(https:\/\/cdn\d*\.cdn-telegram\.org\/file\/[^"]+)/g,
              `${talkConfig.serverUrl}?proxy=$1`
            ) : imgTag;
            returnTag = returnTag.replace(
              /\/\/telegram\.org\/img\/emoji\/40\/[A-F0-9]+\.png/g,
              ""
            );
            return returnTag;
          });
          e.time = new Date(e.time).toLocaleString();
          return e;
        });
        isNext ? data.ChannelMessageData.map(
          (e) => talkData.value.ChannelMessageData.push(e)
        ) : talkData.value = data;
      } catch (err) {
        error.value = err;
      }
    };
    const moreClick = () => {
      fetchData(true);
    };
    onMounted(() => {
      fetchData(false);
    });
    return (_ctx, _cache) => {
      const _component_center = resolveComponent("center");
      const _directive_lazy = resolveDirective("lazy");
      return talkData.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(talkData.value.ChannelMessageData, (channelData) => {
          return openBlock(), createElementBlock("div", {
            class: "talk-package",
            id: `talk-package-${channelData.id}`,
            key: channelData.id
          }, [
            createElementVNode("div", _hoisted_3, "#" + toDisplayString(channelData.id), 1),
            createElementVNode("div", {
              class: "talk-text",
              innerHTML: channelData.text
            }, null, 8, _hoisted_4),
            createElementVNode("div", _hoisted_5, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(channelData.image, (imgUrl) => {
                return openBlock(), createElementBlock("div", {
                  class: "talk-img",
                  key: imgUrl
                }, [
                  talkConfig.zoom && imgUrl ? (openBlock(), createBlock(imageZoom, {
                    key: 0,
                    imgUrl,
                    src: imgUrl,
                    options: { container: null }
                  }, null, 8, ["imgUrl", "src"])) : imgUrl ? withDirectives((openBlock(), createElementBlock("img", _hoisted_6, null, 512)), [
                    [_directive_lazy, imgUrl]
                  ]) : createCommentVNode("", true)
                ]);
              }), 128))
            ]),
            createElementVNode("div", _hoisted_7, toDisplayString(channelData.time), 1)
          ], 8, _hoisted_2);
        }), 128)),
        nextBefore.value ? (openBlock(), createBlock(_component_center, { key: 0 }, {
          default: withCtx(() => [
            createElementVNode("span", {
              class: "getMore",
              onClick: moreClick
            }, "从 #" + toDisplayString(nextBefore.value) + " 消息起查看更多", 1)
          ]),
          _: 1
        })) : createCommentVNode("", true)
      ])) : error.value ? (openBlock(), createElementBlock("p", _hoisted_8, "发生了一些错误：" + toDisplayString(error.value), 1)) : (openBlock(), createElementBlock("p", {
        key: 2,
        class: "center",
        innerHTML: nowChip.value
      }, null, 8, _hoisted_9));
    };
  }
};
export {
  _sfc_main as default
};
