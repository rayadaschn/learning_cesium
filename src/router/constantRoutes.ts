/**
 * @description 📚 路由参数配置简介
 * @param path ==> 菜单路径
 * @param name ==> 菜单别名
 * @param redirect ==> 重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * */

import { RouteRecordRaw } from 'vue-router'

/**
 * @description 静态路由
 */
export const staticRoutes: RouteRecordRaw[] = [
  // 视角切换
  {
    path: '/',
    name: '相机',
    meta: {
      title: '相机',
      icon: 'Camera',
    },
    component: () => import('@/pages/layout/index.vue'),
    redirect: '/camera',
    children: [
      {
        path: '/camera',
        name: 'camera_flyTo',
        component: () => import('@/pages/camera/flyTo.vue'),
        meta: {
          title: '飞行',
          activePath: '/camera',
        },
      },
    ],
  },
  // 气象变换
  {
    path: '/particle',
    name: '气象',
    meta: {
      title: '气象',
      icon: 'Notification',
    },
    component: () => import('@/pages/layout/index.vue'),
    redirect: '/particle/rain',
    children: [
      {
        path: '/particle/rain',
        name: 'particle_rain',
        component: () => import('@/pages/particle/rain.vue'),
        meta: {
          title: '下雨',
          activePath: '/particle/rain',
        },
      },
      {
        path: '/particle/fog',
        name: 'particle_fog',
        component: () => import('@/pages/particle/fog.vue'),
        meta: {
          title: '大雾',
          activePath: '/particle/fog',
        },
      },
      {
        path: '/particle/snow',
        name: 'particle_snow',
        component: () => import('@/pages/particle/snow.vue'),
        meta: {
          title: '下雪',
          activePath: '/particle/snow',
        },
      },
    ],
  },
  // 加载数据
  {
    path: '/load',
    name: '加载',
    meta: {
      title: '加载',
      icon: 'UploadFilled',
    },
    component: () => import('@/pages/layout/index.vue'),
    redirect: '/load/layers',
    children: [
      {
        path: '/load/layers',
        name: 'load_image',
        component: () => import('@/pages/load/layers.vue'),
        meta: {
          title: 'image图层',
          activePath: '/load/layers',
        },
      },
    ],
  },
  // 特效
  {
    path: '/material',
    name: '材质',
    meta: {
      title: '材质',
      icon: 'Box',
    },
    component: () => import('@/pages/layout/index.vue'),
    redirect: '/material/radiant',
    children: [
      {
        path: 'radiant',
        name: 'material_radiant',
        component: () => import('@/pages/material/radiant.vue'),
        meta: {
          title: '辐射圈',
          activePath: '/material/radiant',
        },
      },
      {
        path: 'highlightRoad',
        name: 'material_highlightRoad',
        component: () => import('@/pages/material/highlightRoad.vue'),
        meta: {
          title: '道路闪烁',
          activePath: '/material/highlightRoad',
        },
      },
      {
        path: 'throughRoad',
        name: 'material_throughRoad',
        component: () => import('@/pages/material/throughRoad.vue'),
        meta: {
          title: '道路穿梭',
          activePath: '/material/throughRoad',
        },
      },
    ],
  },

  // 此路由防止控制台出现No match found for location with path的警告
  {
    path: '/:catchAll(.*)',
    meta: {
      title: '404',
    },
    component: () => import('@/pages/error/error-404.vue'),
  },
]

/**
 * @description 路由未找到
 */
export const notFoundRouter = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  redirect: '404',
}
