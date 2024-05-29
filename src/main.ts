import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const sysBaseUrl = import.meta.env.BASE_URL;
const mode = import.meta.env.MODE;
const sourceCesiumBaseUrl = import.meta.env.VITE_CESIUM_BASE_URL;

// 在不同的 base 路径下（vite.config.ts 中的 base 配置
// 尤其是开发模式用的是拷贝来的 CesiumJS 库文件，最好拼接上 base 路径
// 生产模式使用 CDN 则不用拼接 base 路径
const cesiumBaseUrl =
  mode === "development"
    ? `${sysBaseUrl}${sourceCesiumBaseUrl}`
    : sourceCesiumBaseUrl;

window.CESIUM_BASE_URL = cesiumBaseUrl;

console.log(`🚀 ~ 模式: ${mode}, CESIUM_BASE_URL: ${cesiumBaseUrl}`);

createApp(App).mount("#app");
