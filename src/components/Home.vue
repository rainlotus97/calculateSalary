<template>
    <!-- 首页 -->
    <div class="home">
        <div class="current_time">
            {{ getCurrentTime() }}
        </div>
        <!-- 录入今日退房数据 -->
        <div class="main_title">
            <van-cell-group inset>
                <van-cell v-for="item in salaryList" :key="item.key" :title="item.title + '数'" :value="item.count + ' 个'"
                    @click="editCheckOut(item.key)" />
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

const salaryList = ref(currentSalaryStore.salaryFuncList);

let currentEdit = '';

const show = ref(false);
const editCheckOut = (value: string) => {
    show.value = true;
    currentEdit = value;
};
let currentInputStr = ''
const onInput = (value: string) => {
    currentInputStr += value;
    salaryList.value.forEach((item) => {
        if (item.key === currentEdit) {
            item.count = Number(currentInputStr);
        }
    });
};
const onDelete = () => {
    currentInputStr = currentInputStr.slice(0, -1);
    salaryList.value.forEach((item) => {
        if (item.key === currentEdit) {
            item.count = Number(currentInputStr);
        }
    });
};
const clearNumber = () => {
    currentInputStr = '';
    calculateSalary();
};
const reShowNumber = () => {
    salaryList.value.forEach((item) => {
        if (item.key === currentEdit) {
            currentInputStr = item.count + '';
        }
    });
};

const currentSalary = ref(0);
const calculateSalary = () => {
    if (salaryList.value.length === 0) {
        showToast('请添加方案');
        return;
    }
    const isNotSet = salaryList.value.every((item) => item.count === 0);
    if (isNotSet) {
        console.log('没有记录工资，无需计算');
        return;
    }
    currentSalary.value = salaryList.value.reduce((pre, cur) => {
        return pre + cur.count * cur.value;
    }, 0);
    let daliySalary: SalaryState = {
        date: getCurrentTime(),
        salary: currentSalary.value,
        extraPrice: 0,
        salaryFuncList: salaryList.value,
    }
    currentSalaryStore.addDaySalary(daliySalary);
};

onMounted(() => {
    clearStore();
    let currentDate = getCurrentTime();
    if (currentSalaryStore.date !== currentDate) {
        salaryList.value.forEach((item) => {
            item.count = 0;
        });
        currentSalaryStore.setDate(currentDate);
    }
    calculateSalary();
});

// 初始化时，缓存数据兼容，清除不需要的缓存条目
const clearStore = () => {
    let salaryLocalData = JSON.parse(localStorage.getItem('salary') as string);
    if (salaryLocalData.hasOwnProperty('checkOutSalary')) {
        console.log('曾经存在数据，需要数据兼容');
        let salaryList = salaryLocalData['salaryList'] || [];
        let daySalaryList = salaryLocalData['daySalaryList'] || [];
        localStorage.clear();
        currentSalaryStore.setSalaryList(salaryList);
        currentSalaryStore.setDaySalaryList(daySalaryList);
    }
};


const resetNum = () => {
    salaryList.value.forEach((item) => {
        item.count = 0;
    });
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