<template>
  <div class="emactionExpress">
    <div
      ref="rootElement"
      :class="containerClass"
      style="
        flex-wrap: nowrap;
        max-width: 100%;
        display: flex;
        gap: 0.375rem;
        height: 1.5rem;
      "
      :style="{ fontFamily: fontFamily }"
    >
      <div style="position: relative; user-select: none; display: flex">
        <div
          id="start-smile"
          @click="showAvailable = !showAvailable"
          style="
            display: flex;
            align-self: center;
            border-radius: 800px;
            width: 1rem;
            height: 1rem;
            line-height: 1rem;
            padding: 0.25rem;
          "
          :style="startSmileStyle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="1rem"
            height="1rem"
            id="start-smile-svg"
            style="cursor: pointer"
            :style="startSmileSvgStyle"
          >
            <path
              d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm3.82 1.636a.75.75 0 0 1 1.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 0 1 1.222.87l-.022-.015c.02.013.021.015.021.015v.001l-.001.002-.002.003-.005.007-.014.019a2.066 2.066 0 0 1-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.331 3.331 0 0 1-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 0 1 .183-1.044ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.25 2.25.592.416a97.71 97.71 0 0 0-.592-.416Z"
            ></path>
          </svg>
        </div>
        <div
          class="anim-scale-in reaction-available-popup"
          @click="closePopup"
          :style="{ display: showAvailable ? 'flex' : 'none' }"
          style="
            user-select: none;
            position: absolute;
            top: -3rem;
            font-size: 0.875rem;
            border-radius: 0.375rem;
            padding: 0 0.125rem;
          "
        >
          <span
            v-for="item in availableReactions"
            :key="item.reaction_name"
            @click="react(item.reaction_name)"
            :class="[
              'reaction-available-emoji',
              { 'reaction-available-emoji-reacted': item.meReacted },
            ]"
            style="
              cursor: pointer;
              margin: 0.25rem 0.125rem;
              padding: 0.25rem;
              border-radius: 0.375rem;
            "
          >
            {{ item.emoji }}
          </span>
        </div>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <div
          v-for="item in availableReactions"
          :key="item.reaction_name"
          @click="react(item.reaction_name)"
          :class="[
            item.meReacted
              ? 'reaction-got-reacted'
              : 'reaction-got-not-reacted',
          ]"
          :style="{ display: item.count && item.count > 0 ? 'flex' : 'none' }"
          style="
            user-select: none;
            cursor: pointer;
            justify-content: center;
            align-items: center;
            border-radius: 108px;
            padding: 0 0.25rem;
            font-size: 0.75rem;
          "
        >
          <span style="pointer-events: none">{{ item.emoji }}</span
          ><span style="padding: 0 0.375rem; pointer-events: none">{{
            item.count
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const DEFAULT_EMOJIS =
  "👍,thumbs-up;😄,smile-face;🎉,party-popper;😕,confused-face;❤️,red-heart;🚀,rocket;👀,eyes;👎,thumbs-down;";

const props = defineProps({
  availableArrayString: {
    type: String,
    default:
      "\uD83D\uDC4D,thumbs-up;\uD83D\uDE04,smile-face;\uD83C\uDF89,party-popper;\uD83D\uDE15,confused-face;❤️,red-heart;\uD83D\uDE80,rocket;\uD83D\uDC40,eyes;\uD83D\uDC4E,thumbs-down;",
  },
  endpoint: {
    type: String,
    default: "",
  },
  reactTargetId: {
    type: String,
    default: "",
    required: true,
  },
  theme: {
    type: String,
    default: "system",
  },
  threeDimensional: {
    type: Boolean,
    default: false,
  },
});

const fontFamily = computed(() =>
  props.threeDimensional ? "Emoji Font" : "system-ui"
);

const showAvailable = ref(false);
const availableReactions = ref([]);

const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
  ? "light"
  : "dark";
const containerClass = ref(
  props.theme === "dark" || (props.theme === "system" && systemTheme === "dark")
    ? "container-dark"
    : "container"
);

const startSmileStyle = ref({
  borderColor:
    "var(--start-smile-border-color, var(--start-smile-border-color-default))",
  backgroundColor:
    "var(--start-smile-bg-color, var(--start-smile-bg-color-default))",
});

const startSmileSvgStyle = ref({
  fill: "var(--start-smile-svg-fill-color, var(--start-smile-svg-fill-color-default))",
});

const closePopup = () => {
  showAvailable.value = false;
};

const isFontAdded = ref(false);
const rootElement = ref(null);

const addFontFace = () => {
  if (!isFontAdded.value && rootElement.value) {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: "Emoji Font";
        src: url("https://registry.npmmirror.com/@floatsheep/font/1.0.6/files/seguiemj.woff2");
      }
      .emactionExpress {
        font-family: "Emoji Font";
      }
    `;
    rootElement.value.appendChild(style);
    isFontAdded.value = true;
  }
};

const react = async (reactionName) => {
  const reaction = availableReactions.value.find(
    (ele) => ele.reaction_name === reactionName
  );
  if (!reaction) {
    console.error("未知的 reaction!");
    return;
  }
  const cancel = reaction.meReacted ? true : false;
  const count = Math.max(
    0,
    reaction.count ? reaction.count + (cancel ? -1 : 1) : cancel ? 0 : 1
  );
  const meReacted = !reaction.meReacted;
  availableReactions.value = availableReactions.value.map((val) => {
    if (val.reaction_name === reactionName) {
      val.count = count;
      val.meReacted = meReacted;
    }
    return val;
  });
  showAvailable.value = false;
  // 请求接口，更新 react 数量
  await fetch(
    props.endpoint +
      "/reaction?" +
      new URLSearchParams({
        targetId: props.reactTargetId,
        reaction_name: reactionName,
        diff: cancel ? -1 : 1,
      }),
    { method: "PATCH" }
  );
  // 更新 localStorage
  const storageKey = `meReactedReactions_${props.reactTargetId}`;
  const meReactedReactionsSet = new Set(
    JSON.parse(window.localStorage.getItem(storageKey) || "[]")
  );
  if (cancel) {
    meReactedReactionsSet.delete(reactionName);
  } else {
    meReactedReactionsSet.add(reactionName);
  }
  window.localStorage.setItem(
    storageKey,
    JSON.stringify(Array.from(meReactedReactionsSet))
  );
};

const initReactions = async () => {
  let arrString = props.availableArrayString;
  if (!arrString) {
    arrString = DEFAULT_EMOJIS;
  }
  const arr = arrString
    .split(";")
    .map((val) => {
      const [emoji, reactionName] = val.split(",");
      if (!emoji || !reactionName) {
        return null;
      }
      return { emoji, reaction_name: reactionName };
    })
    .filter((val) => val);
  // 请求接口，获取哪些 emoji 有 reaction 数量
  if (!props.reactTargetId) {
    throw new Error("reactTargetId 不能为空！");
  }
  const {
    data: { reactionsGot },
  } = await fetch(
    props.endpoint +
      "/reactions?" +
      new URLSearchParams({
        targetId: props.reactTargetId,
      }),
    {
      method: "GET",
    }
  )
    .then((resp) => resp.json())
    .then((resp) => {
      if (!resp.data || !Array.isArray(resp.data.reactionsGot)) {
        throw new Error("获取 reactions 出错！");
      }
      return resp;
    });

  // 获得的 reactions 数量放到 arr 里
  reactionsGot.forEach((reaction) => {
    arr.forEach((availableReaction) => {
      if (reaction.reaction_name === availableReaction.reaction_name) {
        availableReaction.count = reaction.count;
      }
    });
  });

  // 读取 localStorage，获取当前用户点击过的 emoji
  const storageKey = `meReactedReactions_${props.reactTargetId}`;
  const meReactedReactions = JSON.parse(
    window.localStorage.getItem(storageKey) || "[]"
  );

  // 当前用户点击状态放到 arr
  meReactedReactions.forEach((reaction_name) => {
    arr.forEach((availableReaction) => {
      if (reaction_name === availableReaction.reaction_name) {
        availableReaction.meReacted = true;
      }
    });
  });

  // 初始化 availableReactions
  availableReactions.value = arr;
};

// 初始化 reactions
onMounted(() => {
  initReactions();
  addFontFace();
});
</script>

<style scoped>
/* default light */
.container {
  --start-smile-border-color-default: #d0d7de;
  --start-smile-border-color-hover-default: #1f232826;
  --start-smile-bg-color-default: #f6f8fa;
  --start-smile-svg-fill-color-default: #656d76;
  --reaction-got-not-reacted-bg-color-default: #fff;
  --reaction-got-not-reacted-bg-color-hover-default: #eaeef2;
  --reaction-got-not-reacted-border-color-default: #d0d7de;
  --reaction-got-not-reacted-text-color-default: #656d76;
  --reaction-got-reacted-bg-color-default: #ddf4ff;
  --reaction-got-reacted-bg-color-hover-default: #b6e3ff;
  --reaction-got-reacted-border-color-default: #0969da;
  --reaction-got-reacted-text-color-default: #0969da;
  --reaction-available-popup-bg-color-default: #fff;
  --reaction-available-popup-border-color-default: #d0d7de;
  --reaction-available-popup-box-shadow-default: #8c959f33 0px 8px 24px 0px;
  --reaction-available-emoji-reacted-bg-color-default: #ddf4ff;
  --reaction-available-emoji-bg-color-hover-default: #f3f4f6;
  --reaction-available-emoji-z-index-default: 100;
  --reaction-available-mask-z-index-default: 80;
}
/* default dark */
.container-dark {
  --start-smile-border-color-default: #21262d;
  --start-smile-border-color-hover-default: #8b949e;
  --start-smile-bg-color-default: #30363d;
  --start-smile-svg-fill-color-default: #7d8590;
  --reaction-got-not-reacted-bg-color-default: #00000000;
  --reaction-got-not-reacted-bg-color-hover-default: #21262d;
  --reaction-got-not-reacted-border-color-default: #30363d;
  --reaction-got-not-reacted-text-color-default: #7d8590;
  --reaction-got-reacted-bg-color-default: #388bfd1a;
  --reaction-got-reacted-bg-color-hover-default: #0c2d6b;
  --reaction-got-reacted-border-color-default: #1f6feb;
  --reaction-got-reacted-text-color-default: #2f81f7;
  --reaction-available-popup-bg-color-default: #161b22;
  --reaction-available-popup-border-color-default: #30363d;
  --reaction-available-popup-box-shadow-default: #010409 0px 8px 24px 0px;
  --reaction-available-emoji-reacted-bg-color-default: #388bfd1a;
  --reaction-available-emoji-bg-color-hover-default: #30363d;
  --reaction-available-emoji-z-index-default: 100;
  --reaction-available-mask-z-index-default: 80;
}
.anim-scale-in {
  animation-name: scale-in;
  animation-duration: 0.15s;
  animation-timing-function: cubic-bezier(0.2, 0, 0.13, 1.5);
}

@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
#start-smile {
  border-width: 1px;
  border-style: solid;
  border-color: var(
    --start-smile-border-color,
    var(--start-smile-border-color-default)
  );
  background-color: var(
    --start-smile-bg-color,
    var(--start-smile-bg-color-default)
  );
}
#start-smile:hover {
  border-color: var(
    --start-smile-border-color-hover,
    var(--start-smile-border-color-hover-default)
  ) !important;
}
#start-smile-svg {
  fill: var(
    --start-smile-svg-fill-color,
    var(--start-smile-svg-fill-color-default)
  );
}
.reaction-got-not-reacted {
  background-color: var(
    --reaction-got-not-reacted-bg-color,
    var(--reaction-got-not-reacted-bg-color-default)
  );
  border-width: 1px;
  border-style: solid;
  border-color: var(
    --reaction-got-not-reacted-border-color,
    var(--reaction-got-not-reacted-border-color-default)
  );
  color: var(
    --reaction-got-not-reacted-text-color,
    var(--reaction-got-not-reacted-text-color-default)
  );
}
.reaction-got-not-reacted:hover {
  background-color: var(
    --reaction-got-not-reacted-bg-color-hover,
    var(--reaction-got-not-reacted-bg-color-hover-default)
  );
}
.reaction-got-reacted {
  background-color: var(
    --reaction-got-reacted-bg-color,
    var(--reaction-got-reacted-bg-color-default)
  );
  border-width: 1px;
  border-style: solid;
  border-color: var(
    --reaction-got-reacted-border-color,
    var(--reaction-got-reacted-border-color-default)
  );
  color: var(
    --reaction-got-reacted-text-color,
    var(--reaction-got-reacted-text-color-default)
  );
}
.reaction-got-reacted:hover {
  background-color: var(
    --reaction-got-reacted-bg-color-hover,
    var(--reaction-got-reacted-bg-color-hover-default)
  );
}
.reaction-available-popup {
  background-color: var(
    --reaction-available-popup-bg-color,
    var(--reaction-available-popup-bg-color-default)
  );
  border-width: 1px;
  border-style: solid;
  border-color: var(
    --reaction-available-popup-border-color,
    var(--reaction-available-popup-border-color-default)
  );
  box-shadow: var(
    --reaction-available-popup-box-shadow,
    var(--reaction-available-popup-box-shadow-default)
  );
}
.reaction-available-emoji {
  z-index: var(
    --reaction-available-emoji-z-index,
    var(--reaction-available-emoji-z-index-default)
  );
}
.reaction-available-emoji:hover {
  background-color: var(
    --reaction-available-emoji-bg-color-hover,
    var(--reaction-available-emoji-bg-color-hover-default)
  );
}
.reaction-available-emoji-reacted {
  background-color: var(
    --reaction-available-emoji-reacted-bg-color,
    var(--reaction-available-emoji-reacted-bg-color-default)
  );
}
.reaction-available-popup::before {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(
    --reaction-available-mask-z-index,
    var(--reaction-available-mask-z-index-default)
  );
  display: block;
  cursor: default;
  content: " ";
  background: transparent;
}
</style>
