<template>
    <!-- 首页 -->
    <div class="home">
        <div class="current_time">
            {{ getCurrentTime() }}
        </div>
        <!-- 录入今日退房数据 -->
        <div class="main_title">
            <van-cell-group inset>
                <van-cell title="退房数" :value="checkOut + ' 个'" @click="editCheckOut('checkOut')" />
                <van-cell title="续住数" :value="extendStay + ' 个'" @click="editCheckOut('extendStay')" />
            </van-cell-group>
        </div>

        <!-- 今日工资 -->
        <div class="main_title">
            <van-cell-group inset>
                <van-cell title="今日工资" :value="currentSalary + ' 元'" />
            </van-cell-group>
        </div>

        <div class="main_title">
            <van-cell-group inset>
                <van-cell title="重置个数" @click="resetNum" />
            </van-cell-group>
        </div>

        <!-- 数字键盘 -->
        <van-number-keyboard :show="show" @blur="show = false" @input="onInput" @delete="onDelete" @show="reShowNumber"
            @hide="clearNumber" @close="clearNumber" />

    </div>
</template>
    
<script setup lang='ts'>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { salaryStore } from '@/stores/Salary';
import { showToast } from 'vant';
import { SalaryState } from '@/common';
const currentSalaryStore = salaryStore();

const checkOut = ref(currentSalaryStore.checkOutNum);
const extendStay = ref(currentSalaryStore.extendNum);

let currentEdit = 'checkOut';

const show = ref(false);
const editCheckOut = (value: string) => {
    show.value = true;
    currentEdit = value;
};
let currentInputStr = ''
const onInput = (value: string) => {
    currentInputStr += value;
    if (currentEdit === 'checkOut') {
        checkOut.value = Number(currentInputStr);
        currentSalaryStore.setCheckOutNum(Number(currentInputStr));
    } else {
        extendStay.value = Number(currentInputStr);
        currentSalaryStore.setExtendNum(Number(currentInputStr));
    }
};
const onDelete = () => {
    currentInputStr = currentInputStr.slice(0, -1);
    if (currentEdit === 'checkOut') {
        checkOut.value = Number(currentInputStr);
        currentSalaryStore.setCheckOutNum(Number(currentInputStr));
    } else {
        extendStay.value = Number(currentInputStr);
        currentSalaryStore.setExtendNum(Number(currentInputStr));
    }
};
const clearNumber = () => {
    currentInputStr = '';
    calculateSalary();
};
const reShowNumber = () => {
    if (currentEdit === 'checkOut') {
        currentInputStr = checkOut.value + '';
    } else {
        currentInputStr = extendStay.value + '';
    }
};

const currentSalary = ref(0);
const calculateSalary = () => {
    const checkOutPrice = currentSalaryStore.checkOutSalary;
    const extendStayPrice = currentSalaryStore.extendSalary;
    if (checkOutPrice === 0 || extendStayPrice === 0) {
        showToast('请设置退房单价和续住单价');
        return;
    }
    if (checkOut.value === 0 && extendStay.value === 0) {
        console.log('没有记录工资，无需计算');
        return;
    }
    currentSalary.value = checkOut.value * checkOutPrice + extendStay.value * extendStayPrice + currentSalaryStore.foodPrice || 0;
    let daliySalary: SalaryState = {
        date: getCurrentTime(),
        salary: currentSalary.value
    }
    currentSalaryStore.addDaySalary(daliySalary);
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