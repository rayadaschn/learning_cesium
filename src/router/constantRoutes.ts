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
