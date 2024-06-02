import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// 下面是为了查看一下配置是否正常~
// const sysBaseUrl = import.meta.env.BASE_URL; // vite.config.ts 中的 base 配置
// const mode = import.meta.env.MODE; // 当前模式
// const sourceCesiumBaseUrl = import.meta.env.VITE_CESIUM_BASE_URL;

// // 生产模式使用 CDN 则不用拼接 base 路径
// const cesiumBaseUrl =
//   mode === "development"
//     ? `${sysBaseUrl}${sourceCesiumBaseUrl}`
//     : sourceCesiumBaseUrl;

// window.CESIUM_BASE_URL = cesiumBaseUrl;

// console.log(`🚀 ~ 模式: ${mode}, CESIUM_BASE_URL: ${cesiumBaseUrl}`);

createApp(App).mount("#app");
