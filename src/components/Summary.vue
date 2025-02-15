<template>
    <div class="summary">
        <div class="flex-main">
            <div class="flex-item" :class="item.select ? 'active-item' : 'default-item'" v-for="item, index in showList"
                :key="index" @click="selectOne(item)">
                {{ item.text }}
            </div>
            <van-calendar v-model:show="showCalendar" ref="calendarRef" switch-mode="month" type="range"
                @confirm="onConfirm" />
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
            <div class="show-item" v-for="item, index in currentList" :key="index" @click="showDetail(item)">
                <van-cell-group inset>
                    <van-cell title="日期" :value="item.date" />
                    <van-cell title="工资" :value="item.salary + (item?.extraPrice || 0) + ' 元'" />
                </van-cell-group>
            </div>
        </div>

        <van-popup v-model:show="showCenter" round class="detail_popup">
            <van-cell-group inset>
                <van-cell title="日期" :value="showItem.date" />
                <van-cell title="总工资" :value="showItem.salary + (showItem.extraPrice || 0) + ' 元'" />
                <van-cell title="额外补贴" v-if="showItem.extraPrice" :value="showItem.extraPrice + ' 元'" />
                <div class="detail_item" v-for="item in showItem.salaryFuncList" :key="item.key">
                    <van-cell v-if="item.count > 0 && item.value > 0" :title="item.title + '工资'"
                        :value="item.count * item.value + ' 元'"
                        :label="item.title + '单价: ' + item.value + '元' + '&nbsp;&nbsp;' + item.title + '数: ' + item.count + '个'" />
                </div>
            </van-cell-group>
        </van-popup>
    </div>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue';
import { salaryStore } from '@/stores/Salary';
import { reactive } from 'vue';
import { SalaryState, TimeType, calculateDateSort } from '@/common';
import { onMounted } from 'vue';
import type { CalendarInstance } from 'vant';

const calendarRef = ref<CalendarInstance>();

const currentSalary = salaryStore();

const showList = reactive<TimeType[]>([
    { text: '本月工资', select: true },
    { text: '上月工资', select: false },
    { text: '半年工资', select: false },
    { text: '一年工资', select: false },
    { text: '全部工资', select: false },
    { text: '选择时间', select: false },
]);

const totalDays = ref(0);
const totalSalaryAll = ref(0);
const currentList = reactive<SalaryState[]>([]);
const showCalendar = ref(false);
const onConfirm = (values: [Date, Date]) => {
    const [start, end] = values;
    showCalendar.value = false;
    // 计算时间段内的数据
    let currenDatetList: SalaryState[] = [];
    currentSalary.daySalaryList.forEach((item: SalaryState) => {
        const targetDate = calculateDateSort(item.date);
        if (targetDate >= start && targetDate <= end) {
            currenDatetList.push(item);
            totalDays.value += 1;
            item.extraPrice = item.extraPrice || 0;
            totalSalaryAll.value += item.salary + item.extraPrice;
        }
    });
    currentList.push(...currenDatetList);
    calendarRef.value?.reset();
};

const selectOne = (item: TimeType) => {
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
            item.extraPrice = item.extraPrice || 0;
            totalSalaryAll.value += item.salary + item.extraPrice;
        });
    }
    else if (text === '本月工资' || text === '上月工资') {
        let dateKey = year + ' 年 ' + month + ' 月';

        daySalaryList.forEach((item: SalaryState) => {
            if (item.date.includes(dateKey)) {
                currenDatetList.push(item);
                totalDays.value += 1;
                item.extraPrice = item.extraPrice || 0;
                totalSalaryAll.value += item.salary + item.extraPrice;
            }
        });
    }
    else if (text === '选择时间') {
        showCalendar.value = true;
    }
    else {
        let dateKey = year + ' 年 ' + month + ' 月' + ' 1 日';
        daySalaryList.forEach((item: SalaryState) => {
            if (calculateDateSort(item.date) >= calculateDateSort(dateKey)) {
                currenDatetList.push(item);
                totalDays.value += 1;
                item.extraPrice = item.extraPrice || 0;
                totalSalaryAll.value += item.salary + item.extraPrice;
            }4
        });
    }
    currentList.push(...currenDatetList);

}

const showCenter = ref(false);
let showItem: SalaryState = reactive<SalaryState>({ date: '', salary: 0, extraPrice: 0, salaryFuncList: [] });
const showDetail = (item: SalaryState) => {
    showCenter.value = true;
    showItem = item;
}
</script>
    
<style lang="less" scoped>
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
        overflow: auto;
        height: calc(100vh - 258px);
        padding-bottom: 50px;

        .show-item {
            margin-top: 16px;
        }
    }

    .detail_popup {
        width: 90%;
        max-height: calc(100% - 32px);
        padding: 16px 0;
        overflow: auto;
        background-color: antiquewhite;

        .detail_item {
            :deep(.van-cell__title) {
                flex: 2 !important;
            }
        }
    }
}
</style>