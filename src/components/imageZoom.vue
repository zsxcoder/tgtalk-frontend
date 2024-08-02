<script setup>
import { watch } from "vue";
import mediumZoom from "medium-zoom";

let zoom = null;

const props = defineProps({
  options: Object,
  imgUrl: String,
});

function getZoom() {
  if (zoom === null) {
    zoom = mediumZoom(props.options);
  }

  return zoom;
}

function attachZoom(ref) {
  const image = ref && ref.tagName === "IMG" ? ref : null;
  const zoom = getZoom();

  if (image) {
    zoom.attach(image);
  } else {
    zoom.detach();
  }
}

watch(
  () => props.options,
  (options) => {
    const zoom = getZoom();
    zoom.update(options || {});
  }
);
</script>

<template>
  <img v-lazy="props.imgUrl" :ref="attachZoom" />
</template>
