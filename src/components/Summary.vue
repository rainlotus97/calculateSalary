<template>
    <div class="summary">
        <div class="flex-main">
            <div class="flex-item" :class="item.select ? 'active-item' : 'default-item'" v-for="item, index in showList"
                :key="index" @click="selectOne(item)">
                {{ item.text }}
            </div>
        </div>

        <div class="total-num">
            <div class="total-item">
                <span>总出勤：</span> <span>{{ totalDays }} 天</span>
            </div>
            <div class="total-item">
                <span>总工资：</span> <span>{{ totalSalaryAll }} 元</span>
            </div>
        </div>

        <div class="show-list">
            <div class="show-item" v-for="item, index in currentList" :key="index">
                <van-cell-group inset>
                    <van-cell title="日期" :value="item.date" />
                    <van-cell title="工资" :value="item.salary + item.extraPrice || 0 + ' 元'" />
                </van-cell-group>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue';
import { salaryStore } from '@/stores/Salary';
import { reactive } from 'vue';
import { SalaryState, calculateDateSort } from '@/common';
import { onMounted } from 'vue';

const currentSalary = salaryStore();

const showList = reactive([
    { text: '本月工资', select: true },
    { text: '上月工资', select: false },
    { text: '半年工资', select: false },
    { text: '一年工资', select: false },
    { text: '全部工资', select: false },
]);

const totalDays = ref(0);
const totalSalaryAll = ref(0);
const currentList = reactive<SalaryState[]>([]);

const selectOne = (item: any) => {
    showList.forEach((i) => {
        i.select = false;
    });
    item.select = true;
    totalDays.value = 0;
    totalSalaryAll.value = 0;
    currentList.length = 0;
    selectMonth(item.text);
};

onMounted(() => {
    selectMonth('本月工资');
});

const selectMonth = (text: string) => {
    let currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let daySalaryList = currentSalary.daySalaryList;
    let currenDatetList: SalaryState[] = [];
    if (text === '上月工资') {
        if (month === 1) {
            month = 12;
            year = year - 1;
        } else {
            month = month - 1;
        }
    }
    else if (text === '半年工资') {
        if (month < 6) {
            month = 12 + month - 6;
            year = year - 1;
        } else {
            month = month - 6;
        }
    }
    else if (text === '一年工资') {
        year = year - 1;
    }

    if (text === '全部工资') {
        daySalaryList.forEach((item: SalaryState) => {
            currenDatetList.push(item);
            totalDays.value += 1;
            item.extraPrice = item.extraPrice || currentSalary.foodPrice || 0;
            totalSalaryAll.value += item.salary + item.extraPrice;
        });
    }
    else if (text === '本月工资' || text === '上月工资') {
        let dateKey = year + ' 年 ' + month + ' 月';

        daySalaryList.forEach((item: SalaryState) => {
            if (item.date.includes(dateKey)) {
                currenDatetList.push(item);
                totalDays.value += 1;
                item.extraPrice = item.extraPrice || currentSalary.foodPrice || 0;
                totalSalaryAll.value += item.salary + item.extraPrice;
            }
        });
    }
    else {
        let dateKey = year + ' 年 ' + month + ' 月' + ' 1 日';
        daySalaryList.forEach((item: SalaryState) => {
            if (calculateDateSort(item.date) >= calculateDateSort(dateKey)) {
                currenDatetList.push(item);
                totalDays.value += 1;
                item.extraPrice = item.extraPrice || currentSalary.foodPrice || 0;
                totalSalaryAll.value += item.salary + item.extraPrice;
            }
        });
    }
    currentList.push(...currenDatetList);

}


</script>
    
<style lang="less">
.summary {
    padding: 0 16px 50px;

    .flex-main {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;

        .flex-item {
            margin-bottom: 16px;
            width: 110px;
            text-align: center;
            padding: 8px;
            font-family: serif;
            font-size: 20px;
            font-weight: bold;
        }

        .active-item {
            color: #1989fa;
        }

        .default-item {
            color: #000;
        }
    }

    .total-num {
        margin-top: 16px;
        font-size: 20px;
        font-weight: bold;
        display: flex;

        .total-item {
            margin-top: 8px;
            flex: 1;
            text-align: center;
        }
    }

    .show-list {
        margin-top: 16px;
        height: calc(100vh - 240px);
        overflow: auto;

        .show-item {
            margin-top: 16px;
        }
    }
}
</style>