# Cesium Learning 记录

基于 Vue3 + TypeScript + Vite + Cesium 实现 Cesium 的各种效果，致力于封装各种场景 -- hooks 化，高效复用。

`demoPage` 中为学习的各个实例，快速复盘可以看笔者的[《Cesium 快速入门》](https://rayadaschn.github.io/front-end-life/Framework/Cesium/Cesium01.html)系列。

> 在 `src/const/token.ts` 中 需要个人前往天地图等专题注册个人 Token。
>
> 在 dev 分支中，笔者采用 Cesium 的 CDN 进行分包，打包构建速度较快，但是缺点在于，由于采用的是 `/` baseurl 导致无法自由的部署到服务器上，只能部署到根路径下，或额外采用 nginx 进行重载。因此，在本分支上，笔者采用 vite 的插件 `vite-plugin-cesium` 进行打包。当然在开发环境下，俩种并无区别。
>
> github 部署的预览地址为 [github](https://rayadaschn.github.io/learning_cesium/#/camera)，但需要注意的是，由于 github 的限制，未解决跨域问题，因此切换图层的效果会存在问题。

项目中使用到的数据源：

1. [天地图](http://lbs.tianditu.gov.cn/)
2. [mars3d](http://mars3d.cn/doc.html#start/get-started)

## 已完成效果

- [x] 视角切换
- [x] 天气效果: 雪天
- [x] 天气效果: 大雾
- [x] 天气效果: 雨天
- [x] 图层管理
- [x] 键盘按键控制
- [x] 道路闪烁
- [x] 距离测量
- [x] 面积测量
