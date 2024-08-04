<template>
  <template v-if="talkData">
    <div id="talk-wrapper">
      <div
        class="talk-package"
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
              ><img v-lazy="imgUrl" :src="imgUrl" v-viewer />
            </template>
            <template v-else-if="imgUrl"><img v-lazy="imgUrl" /></template>
          </div>
        </div>
        <template v-if="talkConfig.custom.emaction.enable">
          <emactionExpress
            :availableArrayString="
              talkConfig.custom.emaction.availableArrayString
            "
            :endpoint="talkConfig.custom.emaction.endpoint"
            :reactTargetId="channelData.id"
            :theme="talkConfig.custom.emaction.theme"
            :threeDimensional="talkConfig.custom.emaction.threeDimensional"
          />
        </template>
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
import emactionExpress from "./components/emactionExpress.vue";
import { baseAssets } from "./shared/baseAssets";

const props = defineProps({
  config: Object,
});

const talkConfig = {
  serverUrl: props.config.serverUrl || "",
  selector: props.config.selector,
  zoom: props.config.zoom || false,
  custom: props.config.custom || {
    proxy: {
      proxyUrl: props.config.serverUrl,
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
};

const loadLyrics = baseAssets.loadingLyric;

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
      e.text = e.text.replace(
        /<a[^>]*?(#SFCN|href="[^"]*SFCN[^"]*")[^>]*>.*?<\/a>/gi,
        ""
      );
      e.image = e.image.map((imgTag) => {
        let returnTag = talkConfig.custom.proxy.image
          ? imgTag.replace(
              /(https:\/\/cdn\d*\.cdn-telegram\.org\/file\/[^"]+)/g,
              `${talkConfig.custom.proxy.proxyUrl}/?proxy=$1`
            )
          : imgTag;
        returnTag = returnTag.replace(
          /\/\/telegram\.org\/img\/emoji\/40\/[A-F0-9]+\.png/g,
          ""
        );
        return returnTag;
      });
      e.time = new Date(e.time).toLocaleString();
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
  word-wrap: break-word;
  word-break: break-all;
  line-height: normal;
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
  margin-top: 0.5rem;
}
.talk-package > .talk-id {
  margin-left: auto;
  margin-bottom: auto;
  font-size: 24px;
}
.talk-package > .talk-text {
  width: 100%;
}
.talk-package > .talk-text pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.talk-package > .talk-text i.emoji {
  font-style: normal !important;
  background-image: none !important;
  background: none !important;
}
.talk-package > .emactionExpress {
  margin-top: 0.5rem;
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
.shady {
  color: #000;
  background-color: #000;
  transition: 0.1s;
  border-radius: 10.1%;
  border-radius: 0.3rem !important;
  padding: 0.2rem;
  -webkit-transition: 0.1s;
  -moz-transition: 0.1s;
  -ms-transition: 0.1s;
  -o-transition: 0.1s;
  -webkit-border-radius: 10.1%;
  -moz-border-radius: 10.1%;
  -ms-border-radius: 10.1%;
  -o-border-radius: 10.1%;
}

.shady s {
  opacity: 0;
  transition: 0.1s;
  -webkit-transition: 0.1s;
  -moz-transition: 0.1s;
  -ms-transition: 0.1s;
  -o-transition: 0.1s;
}

.shady:hover {
  color: #fff;
  border-radius: 10.1%;
  text-shadow: 0 0 5px #fff, 0 0 5px #fff;
  transition: 0.1s;
  -webkit-transition: 0.1s;
  -moz-transition: 0.1s;
  -ms-transition: 0.1s;
  -o-transition: 0.1s;
  -webkit-border-radius: 10.1%;
  -moz-border-radius: 10.1%;
  -ms-border-radius: 10.1%;
  -o-border-radius: 10.1%;
}

.shady:hover s {
  opacity: 1;
  border-radius: 10.1%;
  text-shadow: 0 0 5px #fff, 0 0 5px #fff;
  transition: 0.1s;
  -webkit-transition: 0.1s;
  -moz-transition: 0.1s;
  -ms-transition: 0.1s;
  -o-transition: 0.1s;
  -webkit-border-radius: 10.1%;
  -moz-border-radius: 10.1%;
  -ms-border-radius: 10.1%;
  -o-border-radius: 10.1%;
}
</style>
