import { createApp } from "vue";
import App from "./App.vue";
import lazyPlugin from "vue3-lazy";
import VueViewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import error from "../assets/cross_mark_3d.webp?inline";
import loading from "../assets/loading_gray.webp?inline";

class tgTalker {
  constructor({ serverUrl, selector, zoom, custom }) {
    this.app = null;
    this.serverUrl = serverUrl;
    this.selector = selector;
    this.zoom = zoom;
    this.custom = custom;
  }

  init() {
    const mountContainer = document.querySelector(this.selector);
    if (mountContainer) {
      this.app = createApp(App, { config: this.getConfig() });
      this.app.use(lazyPlugin, {
        loading,
        error,
      });
      this.app.use(VueViewer, {
        defaultOptions: {
          title: false,
          toolbar: false,
          navbar: false,
        },
      });
      this.app.mount(mountContainer);
      return true;
    } else {
      throw new Error("mountContainer not found");
    }
  }

  destroy() {
    if (this.app) {
      this.app.unmount();
      return true;
    } else {
      throw new Error("mountContainer not found");
    }
  }

  getConfig() {
    return {
      serverUrl: this.serverUrl,
      selector: this.selector,
      zoom: this.zoom,
      custom: this.custom,
    };
  }
}

window.tgTalker = tgTalker;
