<script setup>
import { ref, watch } from 'vue'
import { staticRoutes } from '@/router/constantRoutes.ts'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const activePath = ref()

const subMenu = staticRoutes.filter((item) => item.meta.title !== '404')

const onExpand = () => {
  isCollapse.value = !isCollapse.value
}

const linkTo = (name, path) => {
  activePath.value = path
  router.push({
    name,
  })
}
</script>
<template>
  <el-menu
    active-text-color="#b5b1b1"
    background-color="#545c64"
    class="el-menu-vertical"
    text-color="#fff"
    :collapse="isCollapse"
    :default-active="activePath"
  >
    <el-sub-menu
      popper-class="pop-item"
      v-for="item in subMenu"
      :key="item.path"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <el-menu-item
          v-for="el in item.children"
          :key="el.meta?.activePath"
          :index="el.meta?.activePath"
          @click="linkTo(el.name)"
        >
          {{ el.meta?.title }}
        </el-menu-item>
      </template>
    </el-sub-menu>
    <el-icon class="expand-icon" :size="30" color="#fff" @click="onExpand">
      <Expand v-if="isCollapse" />
      <Fold v-else />
    </el-icon>
  </el-menu>
</template>
<style scoped lang="scss">
.el-menu-vertical:not(.el-menu--collapse) {
  min-height: 100vh;
  position: relative;
  padding-bottom: 30px;
  width: 150px;
}

.el-menu--collapse {
  min-height: 100vh;
}

.expand-icon {
  display: block;
  width: 100%;
  text-align: right;
  cursor: pointer;
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: larger;
}
</style>
