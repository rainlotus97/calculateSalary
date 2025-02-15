<script setup lang="ts">
import Summary from '@/components/Summary.vue';
import Home from '@/components/Home.vue';
import Mine from '@/components/Mine.vue';
import { ref, reactive } from 'vue';
import 'vant/es/toast/style';
import 'vant/es/notify/style'

const tabBar = reactive([
  { icon: 'home-o', text: '首页' },
  { icon: 'add-o', text: '记账' },
  { icon: 'wap-home-o', text: '登记' },
  { icon: 'user-o', text: '我的' },
]);

const active = ref(2);
</script>

<template>
  <div id="main">
    <van-tabbar v-model="active">
      <!-- 循环 -->
      <van-tabbar-item v-for="(item, index) in tabBar" :key="index" :icon="item.icon">{{ item.text }}</van-tabbar-item>
    </van-tabbar>

    <div class="container">
      <div v-if="active === 0">
        <Summary></Summary>
      </div>
      <div v-else-if="active === 1">
        <Home></Home>
      </div>
      <div v-else-if="active === 2">
        <Register></Register>
      </div>
      <div v-else>
        <Mine></Mine>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.container {
  padding-top: 20px;
  height: calc(100vh - var(--van-tabbar-height));
}
</style>
