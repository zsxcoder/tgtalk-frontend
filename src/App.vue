<template>
  <template v-if="talkData">
    <div id="talk-wrapper">
      <div
        class="talk-package"
        v-for="channelData in talkData.ChannelMessageData"
        :key="channelData.id"
      >
        <!-- 头像 -->
        <img 
          :src="channelData.avatar || talkConfig.defaultAvatar" 
          class="talk-avatar"
          alt="头像"
        />
        
        <!-- 内容区域 -->
        <div class="talk-content">
          <!-- 昵称和发布时间 -->
          <div class="talk-header">
            <span class="talk-name">{{ channelData.name || talkConfig.defaultName }}</span>
            <span class="talk-time">{{ formatTime(channelData.time) }}</span>
          </div>
          
          <!-- 文本内容 -->
          <div class="talk-text" v-html="channelData.text"></div>
          
          <!-- 图片列表 -->
          <div class="talk-img-list" :class="'img-count-' + channelData.image.length">
            <div
              class="talk-img"
              v-for="(imgUrl, index) in channelData.image"
              :key="index"
            >
              <template v-if="talkConfig.zoom && imgUrl"
                ><img v-lazy="imgUrl" :src="imgUrl" v-viewer />
              </template>
              <template v-else-if="imgUrl"><img v-lazy="imgUrl" /></template>
            </div>
          </div>
          
          <!-- 评价组件 -->
          <template v-if="talkConfig.custom.emaction.enable">
            <emactionExpress
              :availableArrayString="
                talkConfig.custom.emaction.availableArrayString
              "
              :endpoint="talkConfig.custom.emaction.endpoint"
              :reactTargetId="'tgtalk-evaluate-id-' + channelData.id"
              :theme="talkConfig.custom.emaction.theme"
              :threeDimensional="talkConfig.custom.emaction.threeDimensional"
            />
          </template>
        </div>
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
    <p class="error-message">请求数据时发生了一些错误：{{ error }}</p>
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
  serverUrl: props.config.serverUrl || "https://tg-api.mcyzsx.top",
  selector: props.config.selector,
  zoom: props.config.zoom || false,
  defaultAvatar: props.config.defaultAvatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E",
  defaultName: props.config.defaultName || "Telegram 频道",
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

// 格式化时间显示
const formatTime = (time) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚';
  }
  // 小于1小时
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前';
  }
  // 小于24小时
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前';
  }
  // 小于7天
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前';
  }
  
  // 超过7天显示具体日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  if (year === now.getFullYear()) {
    return `${month}-${day} ${hour}:${minute}`;
  }
  return `${year}-${month}-${day} ${hour}:${minute}`;
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
/* 朋友圈风格样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#talk-wrapper {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 10px;
}

.talk-package {
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* 头像 */
.talk-avatar {
  width: 45px;
  height: 45px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-right: 12px;
  background-color: #f0f0f0;
  object-fit: cover;
}

/* 内容区域 */
.talk-content {
  flex: 1;
  min-width: 0;
}

/* 头部：昵称和时间 */
.talk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 4px;
}

.talk-name {
  font-size: 16px;
  font-weight: 500;
  color: #576b95;
  word-break: break-word;
}

.talk-time {
  font-size: 12px;
  color: #999999;
  white-space: nowrap;
}

/* 文本内容 */
.talk-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333333;
  word-wrap: break-word;
  word-break: break-word;
  margin-bottom: 8px;
}

.talk-text pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0;
  font-size: 13px;
}

.talk-text i.emoji {
  font-style: normal !important;
  background-image: none !important;
  background: none !important;
}

/* 图片列表 */
.talk-img-list {
  display: grid;
  gap: 6px;
  margin-top: 8px;
}

/* 单张图片 */
.talk-img-list.img-count-1 {
  grid-template-columns: 1fr;
}

.talk-img-list.img-count-1 .talk-img img {
  max-width: 100%;
  max-height: 300px;
}

/* 两张图片 */
.talk-img-list.img-count-2 {
  grid-template-columns: repeat(2, 1fr);
}

/* 三张及以上图片 */
.talk-img-list.img-count-3,
.talk-img-list.img-count-4 {
  grid-template-columns: repeat(3, 1fr);
}

/* 五张及以上图片 - 朋友圈九宫格布局 */
.talk-img-list.img-count-5,
.talk-img-list.img-count-6,
.talk-img-list.img-count-7,
.talk-img-list.img-count-8,
.talk-img-list.img-count-9 {
  grid-template-columns: repeat(3, 1fr);
}

.talk-img {
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
}

.talk-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.3s;
}

.talk-img img:hover {
  opacity: 0.9;
}

/* 评价组件 */
.talk-package > .emactionExpress {
  margin-top: 8px;
}

/* 加载更多按钮 */
.getMore {
  display: inline-block;
  color: #576b95;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #ffffff;
  margin: 10px 0;
}

.getMore:hover {
  background-color: #e8e8e8;
}

/* 错误提示 */
.error-message {
  text-align: center;
  color: #ff4d4f;
  padding: 20px;
  font-size: 14px;
}

/* 加载动画 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #999999;
  font-size: 14px;
  line-height: 1.8;
  padding: 20px;
  text-align: center;
}

/* 响应式设计 - 手机端 */
@media (max-width: 768px) {
  #talk-wrapper {
    padding: 0;
  }
  
  .talk-package {
    border-radius: 0;
    margin-bottom: 0;
    padding: 12px 15px;
    box-shadow: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .talk-avatar {
    width: 42px;
    height: 42px;
    margin-right: 10px;
  }
  
  .talk-name {
    font-size: 15px;
  }
  
  .talk-text {
    font-size: 14px;
  }
  
  .talk-time {
    font-size: 11px;
  }
  
  .talk-img-list {
    gap: 4px;
  }
  
  .talk-img-list.img-count-1 .talk-img img {
    max-height: 200px;
  }
}

/* 响应式设计 - 平板 */
@media (min-width: 769px) and (max-width: 1024px) {
  #talk-wrapper {
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;
  }
}

/* 响应式设计 - 电脑端 */
@media (min-width: 1025px) {
  #talk-wrapper {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;
  }
  
  .talk-package {
    padding: 15px 20px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  #talk-wrapper {
    background-color: #1a1a1a;
  }
  
  .talk-package {
    background-color: #2d2d2d;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid #3d3d3d;
  }
  
  .talk-text {
    color: #e0e0e0;
  }
  
  .talk-text pre {
    background-color: #1a1a1a;
  }
  
  .talk-img {
    background-color: #1a1a1a;
  }
  
  .getMore {
    background-color: #2d2d2d;
  }
  
  .getMore:hover {
    background-color: #3d3d3d;
  }
}
</style>
