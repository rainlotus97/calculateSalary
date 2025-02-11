<template>
    <div class="mine">
        <div class="main_add">
            <van-cell-group inset>
                <div class="salary_item" v-for="item in salaryList" :key="item.key">
                    <van-swipe-cell>
                        <van-cell :title="item.title + '单价'" :value="item.value + ' 元'" @click="editCheckOut(item.key)" />
                        <template #right>
                            <van-button square type="danger" text="删除" @click="delSalaryItem(item.key)" />
                        </template>
                    </van-swipe-cell>
                </div>
            </van-cell-group>
            <van-cell-group inset v-if="isShowNew" :class="{ mt16: salaryList.length }">
                <van-field v-model="salaryTitle" label="标题" />
                <van-field v-model="salaryKey" label="关键词" />
                <van-field v-model="salaryValue" type="digit" label="数值" />
            </van-cell-group>

            <div class="main_plus" :class="{ mt16: salaryList.length }" v-show="!isShowNew">
                <van-button icon="plus" type="primary" @click="addList">添加方案</van-button>
            </div>
            <div class="main_plus_cancel" v-show="isShowNew">
                <van-button type="danger" @click="cancelAdd">取消</van-button>
                <van-button type="primary" @click="confirmAdd">确认</van-button>
            </div>
        </div>

        <div class="clear-all">
            <van-cell-group inset>
                <van-cell title="重置单价" @click="resetStore" />
                <van-cell title="清空列表" @click="clearStore" />
            </van-cell-group>
        </div>

        <div class="add-salary clear-all">
            <van-cell-group inset>
                <van-cell title="增加记录" @click="showPopUp" />
                <van-cell title="删除记录" @click="deletePop" />
            </van-cell-group>
            <van-popup v-model:show="popShow" position="bottom" :style="{ padding: '16px' }">
                <van-cell-group inset>
                    <!-- 年 -->
                    <van-field v-model="yearNumber" label="年" />
                    <!-- 月 -->
                    <van-field v-model="monthNumber" label="月" />
                    <!-- 日 -->
                    <van-field v-model="dayNumber" label="日" />
                    <!-- 退房数 -->
                    <van-field v-for="item in addSalaryList" :key="item.key" v-model="item.inputStr"
                        :label="item.title + '数'" />
                    <van-field v-for="item in addSalaryList" :key="item.key" v-model="item.value" type="digit"
                        :label="item.title + '单价'" />
                </van-cell-group>

                <van-button type="primary" block @click="addSalary">添加</van-button>
            </van-popup>

            <van-popup v-model:show="popShow2" position="bottom" :style="{ padding: '16px' }">
                <van-cell-group inset>
                    <!-- 年 -->
                    <van-field v-model="yearNumber1" label="年" />
                    <!-- 月 -->
                    <van-field v-model="monthNumber1" label="月" />
                    <!-- 日 -->
                    <van-field v-model="dayNumber1" label="日" />
                </van-cell-group>

                <van-button type="danger" block @click="deleteSalary">删除</van-button>
            </van-popup>

        </div>
        <!-- 数字键盘 -->
        <van-number-keyboard :show="show" @blur="show = false" @input="onInput" @delete="onDelete" @show="reShowNumber"
            @hide="clearNumber" @close="clearNumber" />
    </div>
</template>
    
<script setup lang='ts'>
import { SalaryItem } from '@/common';
import { salaryStore } from '@/stores/Salary';
import { ref } from 'vue';
const currentSalary = salaryStore();

const salaryTitle = ref('');
const salaryKey = ref('');
const salaryValue = ref('');
const isShowNew = ref(false);
const salaryList = ref<SalaryItem[]>(currentSalary.salaryFuncList);
let addSalaryList = ref<SalaryItem[]>([]);

const addList = () => {
    isShowNew.value = true;
    console.info('addList');
};

const cancelAdd = () => {
    isShowNew.value = false;
    salaryKey.value = '';
    salaryTitle.value = '';
    salaryValue.value = '';
};

const confirmAdd = () => {
    const salayItem: SalaryItem = {
        title: salaryTitle.value,
        key: salaryKey.value,
        value: Number(salaryValue.value),
        count: 0,
        inputStr: '',
    }
    salaryList.value.push(salayItem);
    currentSalary.addSalaryFunc(salayItem);
    isShowNew.value = false;
    salaryKey.value = '';
    salaryTitle.value = '';
    salaryValue.value = '';
    console.info('confirmAdd');
};

const delSalaryItem = (key: string) => {
    salaryList.value = salaryList.value.filter((item) => item.key !== key);
    currentSalary.deleteSalaryFunc(key);
};
let currentEdit = '';

const show = ref(false);
const editCheckOut = (value: string) => {
    show.value = true;
    currentEdit = value;
};

let currentInputStr = ''
const onInput = (value: string) => {
    currentInputStr += value;
    calculateSalary();
};
const onDelete = () => {
    currentInputStr = currentInputStr.slice(0, -1);
    calculateSalary();
};

const calculateSalary = () => {
    salaryList.value.forEach((item) => {
        if (item.key === currentEdit) {
            item.value = Number(currentInputStr);
        }
    });
};

const clearNumber = () => {
    currentInputStr = '';
};
const reShowNumber = () => {
    salaryList.value.forEach((item) => {
        if (item.key === currentEdit) {
            currentInputStr = item.value + '';
        }
    });
};

const clearStore = () => {
    currentSalary.clear();
};
const resetStore = () => {
    salaryList.value.forEach((item) => {
        item.value = 0;
    });
};
const popShow = ref(false);
const showPopUp = () => {
    popShow.value = true;
    addSalaryList = ref<SalaryItem[]>(JSON.parse(JSON.stringify(salaryList.value)));
    addSalaryList.value.forEach((item) => {
        item.count = 0;
        item.inputStr = '';
    });
};

const popShow2 = ref(false);
const deletePop = () => {
    popShow2.value = true;
};

const yearNumber = ref(new Date().getFullYear() + '');
const monthNumber = ref('');
const dayNumber = ref('');

// 添加/删除工资记录
const addSalary = () => {
    let date = yearNumber.value + ' 年 ' + monthNumber.value + ' 月 ' + dayNumber.value + ' 日';
    let salary = 0;
    addSalaryList.value.forEach((item) => {
        item.count = Number(item.inputStr);
        item.inputStr = '';
        salary += item.count * item.value;
    });
    if (salary === 0) {
        currentSalary.deleteDaySalary(date);
    } else {
        currentSalary.addDaySalary({ date, salary, extraPrice: 0, salaryFuncList: addSalaryList.value });
    }
    popShow.value = false;
};

const yearNumber1 = ref(new Date().getFullYear() + '');
const monthNumber1 = ref('');
const dayNumber1 = ref('');
const deleteSalary = () => {
    let date = yearNumber1.value + ' 年 ' + monthNumber1.value + ' 月 ' + dayNumber1.value + ' 日';
    currentSalary.deleteDaySalary(date);
    popShow2.value = false;
};

</script>
    
<style scoped lang="less">
.mine {
    .mt16 {
        margin-top: 16px;
    }

    .main_plus {
        display: flex;
        justify-content: center;
    }

    .main_plus_cancel {
        margin-top: 16px;
        display: flex;
        justify-content: space-evenly;
    }

    .clear-all {
        margin-top: 16px;
    }
}
</style>