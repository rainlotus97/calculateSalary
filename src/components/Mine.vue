<template>
    <div class="mine">
        <div class="main_title">
            <van-cell-group inset>
                <van-cell title="退房单价" :value="checkOut + ' 元'" @click="editCheckOut('checkOut')" />
                <van-cell title="续住单价" :value="extendStay + ' 元'" @click="editCheckOut('extendStay')" />
                <van-cell title="餐补单价" :value="foodPrice + ' 元'" @click="editCheckOut('foodPrice')" />
            </van-cell-group>
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
                    <van-field v-model="checkOutNumber" label="退房数" />
                    <!-- 续住数 -->
                    <van-field v-model="extendStayNumber" label="续住数" />
                    <!-- 退房单价 -->
                    <van-field v-model="checkOutPrice" label="退房单价" />
                    <!-- 续住单价 -->
                    <van-field v-model="extendStayPrice" label="续住单价" />
                    <!-- 餐补单价 -->
                    <van-field v-model="foodExtraPrice" label="餐补单价" />
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
import { salaryStore } from '@/stores/Salary';
import { ref } from 'vue';
const currentSalary = salaryStore();

const checkOut = ref(currentSalary.checkOutSalary);
const extendStay = ref(currentSalary.extendSalary);
const foodPrice = ref(currentSalary.foodPrice || 0);

let currentEdit = 'checkOut';

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
    if (currentEdit === 'checkOut') {
        checkOut.value = Number(currentInputStr);
        currentSalary.setCheckOutSalary(Number(currentInputStr));
    } else if (currentEdit === 'extendStay') {
        extendStay.value = Number(currentInputStr);
        currentSalary.setExtendSalary(Number(currentInputStr));
    } else {
        foodPrice.value = Number(currentInputStr);
        currentSalary.setFoodPrice(Number(currentInputStr));
    }
};

const clearNumber = () => {
    currentInputStr = '';
};
const reShowNumber = () => {
    if (currentEdit === 'checkOut') {
        currentInputStr = checkOut.value + '';
    } else if (currentEdit === 'extendStay') {
        currentInputStr = extendStay.value + '';
    } else {
        currentInputStr = foodPrice.value + '';
    }
};

const clearStore = () => {
    currentSalary.clear();
};
const resetStore = () => {
    currentSalary.reset();
    checkOut.value = 0;
    extendStay.value = 0;
    foodPrice.value = 0;
};
const popShow = ref(false);
const showPopUp = () => {
    popShow.value = true;
};

const popShow2 = ref(false);
const deletePop = () => {
    popShow2.value = true;
};

const yearNumber = ref(new Date().getFullYear() + '');
const monthNumber = ref('');
const dayNumber = ref('');
const checkOutNumber = ref('');
const extendStayNumber = ref('');
const checkOutPrice = ref('12');
const extendStayPrice = ref('6');
const foodExtraPrice = ref('15');

// 添加/删除工资记录
const addSalary = () => {
    let date = yearNumber.value + ' 年 ' + monthNumber.value + ' 月 ' + dayNumber.value + ' 日';
    let salary = Number(checkOutNumber.value) * Number(checkOutPrice.value) + Number(extendStayNumber.value) * Number(extendStayPrice.value);
    if (salary === 0) {
        currentSalary.deleteDaySalary(date);
    } else {
        currentSalary.addDaySalary({ date, salary, extraPrice: Number(foodExtraPrice.value) });
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
    .main_title {
        margin-top: 16px;
    }

    .clear-all {
        margin-top: 16px;
    }
}
</style>