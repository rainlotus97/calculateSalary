<template>
  <!-- 首页 -->
  <div class="home">
    <div class="current_time">
      {{ getCurrentTime() }}
    </div>
    <!-- 录入今日退房数据 -->
    <div class="main_title">
      <van-cell-group inset>
        <van-cell
          title="退房数"
          :value="checkOut + ' 个'"
          @click="editCheckOut('checkOut')"
        />
        <van-cell
          title="续住数"
          :value="extendStay + ' 个'"
          @click="editCheckOut('extendStay')"
        />
      </van-cell-group>
    </div>

    <!-- 今日工资 -->
    <div class="main_title">
      <van-cell-group inset>
        <van-cell
          title="今日工资"
          :value="currentSalary + currentSalaryStore.foodPrice + ' 元'"
        />
      </van-cell-group>
    </div>

    <div class="main_title">
      <van-cell-group inset>
        <van-cell title="重置个数" @click="resetNum" />
      </van-cell-group>
    </div>

    <!-- 数字键盘 -->
    <NumberKeyboard
      v-model="show"
      :currentInputStr="currentInputStr"
      :currentEdit="currentEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import NumberKeyboard from "@/components/NumberKeyboard.vue";
import useHomeCalculateSalary from "@/hooks/useHomeCalculateSalary";
let currentInputStr = "";
let currentEdit = "checkOut";
const show = ref(false);
const {
  currentSalaryStore,
  checkOut,
  extendStay,
  currentSalary,
  calculateSalary,
} = useHomeCalculateSalary(currentInputStr, currentEdit);
const editCheckOut = (value: string) => {
  show.value = true;
  currentEdit = value;
};

onMounted(() => {
  let currentDate = getCurrentTime();
  if (currentSalaryStore.date !== currentDate) {
    currentSalaryStore.resetTotal();
    checkOut.value = 0;
    extendStay.value = 0;
    currentSalaryStore.setDate(currentDate);
  }
  calculateSalary();
});

const resetNum = () => {
  checkOut.value = 0;
  extendStay.value = 0;
  currentSalary.value = 0;
  currentSalaryStore.resetTotal();
};

// 获取当前时间
const getCurrentTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year} 年 ${month} 月 ${day} 日`;
};
</script>

<style lang="less">
.home {
  height: 100%;
  overflow: hidden;
  .current_time {
    font-size: 30px;
    text-align: center;
    line-height: 50px;
    margin-top: 20px;
    width: 100%;
    height: 50px;
    border-radius: 4px;
    background-color: aliceblue;
    margin-bottom: 20px;
  }

  .main_title {
    margin-bottom: 20px;
  }
}
</style>
