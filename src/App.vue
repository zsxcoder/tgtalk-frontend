<template>
  <template v-if="talkData">
    <div id="talk-wrapper">
      <div
        class="talk-package"
        :id="`talk-package-${channelData.id}`"
        v-for="channelData in talkData.ChannelMessageData"
        :key="channelData.id"
      >
        <div class="talk-id">#{{ channelData.id }}</div>
        <div class="talk-text" v-html="channelData.text"></div>
        <div class="talk-img-list">
          <div
            class="talk-img"
            v-for="imgUrl in channelData.image"
            :key="imgUrl"
          >
            <template v-if="talkConfig.zoom && imgUrl"
              ><imageZoom
                :imgUrl="imgUrl"
                :src="imgUrl"
                :options="{ container: null }"
            /></template>
            <template v-else-if="imgUrl"><img v-lazy="imgUrl" /></template>
          </div>
        </div>
        <div class="talk-time">{{ channelData.time }}</div>
      </div>
      <template v-if="nextBefore">
        <center>
          <span class="getMore" @click="moreClick"
            >从 #{{ nextBefore }} 消息起查看更多</span
          >
        </center>
      </template>
    </div>
  </template>
  <template v-else-if="error">
    <p>发生了一些错误：{{ error }}</p>
  </template>
  <template v-else><p class="center" v-html="nowChip"></p></template>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import imageZoom from "./components/imageZoom.vue";

const props = defineProps({
  config: Object,
});

const talkConfig = {
  serverUrl: props.config.serverUrl || "",
  selector: props.config.selector,
  zoom: props.config.zoom || false,
  custom: props.config.custom || {
    proxy: {
      image: false,
    },
  },
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
  "booooooooooooooom\n",
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
  breaks: false,
});

const fetchData = async (isNext) => {
  try {
    let response;
    isNext
      ? (response = await fetch(
          `${talkConfig.serverUrl}/?startbefore=${nextBefore.value}`
        ))
      : (response = await fetch(talkConfig.serverUrl));
    const data = await response.json();
    nextBefore.value = data.nextBefore;
    data.ChannelMessageData.map((e) => {
      e.text = DOMPurify.sanitize(marked.parse(e.text)).replace(
        /<a[^>]*?(#SFCN|href="[^"]*SFCN[^"]*")[^>]*>.*?<\/a>/gi,
        ""
      );
      e.image = e.image.map((imgTag) => {
        let returnTag = talkConfig.custom.proxy.image
          ? imgTag.replace(
              /(https:\/\/cdn\d*\.cdn-telegram\.org\/file\/[^"]+)/g,
              `${talkConfig.serverUrl}?proxy=$1`
            )
          : imgTag;
        returnTag = returnTag.replace(
          /\/\/telegram\.org\/img\/emoji\/40\/[A-F0-9]+\.png/g,
          ""
        );
        return returnTag;
      });

      e.time = new Date(e.time).toLocaleString();
      return e;
    });
    isNext
      ? data.ChannelMessageData.map((e) =>
          talkData.value.ChannelMessageData.push(e)
        )
      : (talkData.value = data);
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
</script>

<style>
.talk-package {
  display: flex;
  margin: 0 0 3rem 0;
  border: 2px solid #ddd;
  border-radius: 0.8rem;
  padding: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
}
.talk-package > .talk-img-list > .talk-img img {
  max-width: 50%;
  object-fit: contain;
  max-height: 92%;
  margin: 5px;
  width: auto;
}
.talk-package > .talk-img-list {
  margin-left: 1rem;
  flex-basis: 100%;
  align-content: center;
  text-align: center;
}
.talk-package > .talk-time {
  margin-left: auto;
  margin-top: auto;
}
.talk-package > .talk-id {
  margin-left: auto;
  margin-bottom: auto;
  font-size: 24px;
}
.talk-package > .talk-text {
  width: 100%;
}
.talk-package > .talk-text i.emoji {
  font-style: normal !important;
  background-image: none !important;
  background: none !important;
}
.center {
  display: block;
  text-align: -webkit-center;
  unicode-bidi: isolate;
}
.getMore {
  color: #06c;
  transition: all 0.2s;
  cursor: default;
  padding: 0.3rem;
  border: 1px solid transparent;
  border-radius: 15px;
}
.getMore:hover {
  background-color: #06c;
  color: #fff;
  cursor: default;
}
</style>
