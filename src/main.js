import { createApp } from "vue";
import App from "./App.vue";
import lazyPlugin from "vue3-lazy";
import { baseAssets } from "./shared/baseAssets";

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
        loading: baseAssets.loading,
        error: baseAssets.error,
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
