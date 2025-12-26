<template>
  <template v-if="talkData">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle" @click="toggleTheme" :title="isDarkMode ? '切换到亮色模式' : '切换到深色模式'">
      <svg v-if="isDarkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
    <div id="talk-wrapper" :class="{ 'dark-mode': isDarkMode }">
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

// 主题切换逻辑
const isDarkMode = ref(false);

const checkSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const initTheme = () => {
  // 从 localStorage 读取保存的主题
  const savedTheme = localStorage.getItem('tgtalk-theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    isDarkMode.value = checkSystemTheme();
  }
  applyTheme();
};

const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('tgtalk-theme', isDarkMode.value ? 'dark' : 'light');
  applyTheme();
};

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
  initTheme();
  fetchData(false);
});
</script>

<style>
/* 即刻风格样式 - 优化版 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#talk-wrapper {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding: 10px;
  position: relative;
  transition: background-color 0.3s;
}

/* 主题切换按钮 */
.theme-toggle {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.theme-toggle svg {
  width: 22px;
  height: 22px;
  color: #333;
  transition: color 0.3s;
}

/* 卡片样式 */
.talk-package {
  display: flex;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.talk-package:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 头像 */
.talk-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
  margin-right: 12px;
  background-color: #f0f2f5;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.talk-avatar:hover {
  transform: scale(1.05);
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
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 6px;
}

.talk-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  word-break: break-word;
  letter-spacing: 0.3px;
}

.talk-time {
  font-size: 12px;
  color: #8b949e;
  white-space: nowrap;
  background-color: #f0f2f5;
  padding: 2px 8px;
  border-radius: 12px;
}

/* 文本内容 */
.talk-text {
  font-size: 15px;
  line-height: 1.8;
  color: #24292f;
  word-wrap: break-word;
  word-break: break-word;
  margin-bottom: 12px;
  letter-spacing: 0.2px;
}

.talk-text pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f7f8fa;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 13px;
  border-left: 3px solid #0969da;
  overflow-x: auto;
}

.talk-text code {
  background-color: #f6f8fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #d73a49;
}

.talk-text i.emoji {
  font-style: normal !important;
  background-image: none !important;
  background: none !important;
}

.talk-text a {
  color: #0969da;
  text-decoration: none;
  border-bottom: 1px dashed #0969da;
  transition: all 0.2s;
}

.talk-text a:hover {
  color: #0d47a1;
  border-bottom-style: solid;
}

/* 图片列表 */
.talk-img-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

/* 单张图片 - 限制最大高度防止破坏布局 */
.talk-img-list.img-count-1 {
  grid-template-columns: 1fr;
}

.talk-img-list.img-count-1 .talk-img {
  max-width: 100%;
  aspect-ratio: auto;
  max-height: 500px;
  border-radius: 8px;
  background-color: #f7f8fa;
}

.talk-img-list.img-count-1 .talk-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 500px;
}

/* 两张图片 */
.talk-img-list.img-count-2 {
  grid-template-columns: repeat(2, 1fr);
}

.talk-img-list.img-count-2 .talk-img {
  aspect-ratio: 4 / 3;
}

/* 三张图片 */
.talk-img-list.img-count-3 {
  grid-template-columns: repeat(3, 1fr);
}

.talk-img-list.img-count-3 .talk-img {
  aspect-ratio: 1 / 1;
}

/* 四张图片 - 2x2 布局 */
.talk-img-list.img-count-4 {
  grid-template-columns: repeat(2, 1fr);
}

.talk-img-list.img-count-4 .talk-img {
  aspect-ratio: 1 / 1;
}

/* 五张及以上图片 - 九宫格布局 */
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
  background-color: #f7f8fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #e1e4e8;
}

.talk-img:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.talk-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.3s;
  display: block;
}

.talk-img img:hover {
  opacity: 0.9;
}

/* 评价组件 */
.talk-package > .emactionExpress {
  margin-top: 12px;
}

/* 加载更多按钮 */
.getMore {
  display: inline-block;
  color: #0969da;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #ffffff;
  margin: 20px 0;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e1e4e8;
}

.getMore:hover {
  background-color: #0969da;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(9, 105, 218, 0.3);
  transform: translateY(-2px);
}

/* 错误提示 */
.error-message {
  text-align: center;
  color: #d73a49;
  padding: 40px 20px;
  font-size: 15px;
  background-color: #fff8f8;
  border-radius: 12px;
  margin: 20px;
  border-left: 4px solid #d73a49;
}

/* 加载动画 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #8b949e;
  font-size: 15px;
  line-height: 2;
  padding: 40px 20px;
  text-align: center;
}

/* 暗色模式 */
.dark-mode #talk-wrapper,
html.dark-mode #talk-wrapper {
  background-color: #0d1117;
}

.dark-mode .talk-package,
html.dark-mode .talk-package {
  background-color: #161b22;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.dark-mode .talk-avatar,
html.dark-mode .talk-avatar {
  background-color: #21262d;
  border-color: #30363d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .talk-name,
html.dark-mode .talk-name {
  color: #e6edf3;
}

.dark-mode .talk-time,
html.dark-mode .talk-time {
  color: #8b949e;
  background-color: #21262d;
}

.dark-mode .talk-text,
html.dark-mode .talk-text {
  color: #c9d1d9;
}

.dark-mode .talk-text pre,
html.dark-mode .talk-text pre {
  background-color: #0d1117;
  border-left-color: #2f81f7;
  color: #e6edf3;
}

.dark-mode .talk-text code,
html.dark-mode .talk-text code {
  background-color: #161b22;
  color: #ff7b72;
}

.dark-mode .talk-text a,
html.dark-mode .talk-text a {
  color: #58a6ff;
  border-bottom-color: #58a6ff;
}

.dark-mode .talk-text a:hover,
html.dark-mode .talk-text a:hover {
  color: #79c0ff;
}

.dark-mode .talk-img,
html.dark-mode .talk-img {
  background-color: #0d1117;
  border-color: #30363d;
}

.dark-mode .getMore,
html.dark-mode .getMore {
  background-color: #161b22;
  color: #58a6ff;
  border-color: #30363d;
}

.dark-mode .getMore:hover,
html.dark-mode .getMore:hover {
  background-color: #1f6feb;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3);
}

.dark-mode .error-message,
html.dark-mode .error-message {
  background-color: #1c1212;
  color: #ff7b72;
  border-left-color: #ff7b72;
}

.dark-mode .center,
html.dark-mode .center {
  color: #8b949e;
}

.dark-mode .theme-toggle,
html.dark-mode .theme-toggle {
  background-color: rgba(22, 27, 34, 0.95);
  border-color: #30363d;
}

.dark-mode .theme-toggle svg,
html.dark-mode .theme-toggle svg {
  color: #e6edf3;
}

/* 响应式设计 - 手机端 */
@media (max-width: 768px) {
  #talk-wrapper {
    padding: 0;
  }
  
  .talk-package {
    border-radius: 0;
    margin-bottom: 0;
    padding: 16px;
    box-shadow: none;
    border-bottom: 1px solid #e1e4e8;
  }
  
  .dark-mode .talk-package,
  html.dark-mode .talk-package {
    border-bottom-color: #30363d;
  }
  
  .talk-avatar {
    width: 44px;
    height: 44px;
    margin-right: 12px;
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
    gap: 6px;
  }
  
  .talk-img-list.img-count-1 .talk-img {
    max-height: 400px;
  }
  
  .theme-toggle {
    right: 20px;
    bottom: 20px;
    width: 44px;
    height: 44px;
  }
  
  .theme-toggle svg {
    width: 20px;
    height: 20px;
  }
}

/* 响应式设计 - 平板 */
@media (min-width: 769px) and (max-width: 1024px) {
  #talk-wrapper {
    max-width: 680px;
    margin: 0 auto;
    padding: 16px;
  }
}

/* 响应式设计 - 电脑端 */
@media (min-width: 1025px) {
  #talk-wrapper {
    max-width: 680px;
    margin: 0 auto;
    padding: 24px 16px;
  }
  
  .talk-package {
    padding: 20px;
  }
}
</style>
