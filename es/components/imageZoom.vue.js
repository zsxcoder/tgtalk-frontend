import { watch, resolveDirective, withDirectives, openBlock, createElementBlock } from "vue";
import mediumZoom from "medium-zoom";
const _sfc_main = {
  __name: "imageZoom",
  props: {
    options: Object,
    imgUrl: String
  },
  setup(__props) {
    let zoom = null;
    const props = __props;
    function getZoom() {
      if (zoom === null) {
        zoom = mediumZoom(props.options);
      }
      return zoom;
    }
    function attachZoom(ref) {
      const image = ref && ref.tagName === "IMG" ? ref : null;
      const zoom2 = getZoom();
      if (image) {
        zoom2.attach(image);
      } else {
        zoom2.detach();
      }
    }
    watch(
      () => props.options,
      (options) => {
        const zoom2 = getZoom();
        zoom2.update(options || {});
      }
    );
    return (_ctx, _cache) => {
      const _directive_lazy = resolveDirective("lazy");
      return withDirectives((openBlock(), createElementBlock("img", { ref: attachZoom }, null, 512)), [
        [_directive_lazy, props.imgUrl]
      ]);
    };
  }
};
export {
  _sfc_main as default
};
