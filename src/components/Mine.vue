<template>
    <div class="mine">
        <div class="main_title">
            <van-cell-group inset>
                <van-cell title="退房单价" :value="checkOut + ' 元'" @click="editCheckOut('checkOut')" />
                <van-cell title="续住单价" :value="extendStay + ' 元'" @click="editCheckOut('extendStay')" />
            </van-cell-group>
        </div>
        <div class="clear-all">
            <van-cell-group inset>
                <van-cell title="重置单价" @click="resetStore" />
                <van-cell title="清空列表" @click="clearStore" />
            </van-cell-group>
        </div>
        <!-- 数字键盘 -->
        <van-number-keyboard :show="show" @blur="show = false" @input="onInput" @delete="onDelete" @show="reShowNumber"
            @hide="clearNumber" @close="clearNumber" />
    </div>
</template>
    
<script setup lang='ts'>
// import { onMounted } from 'vue';
import { salaryStore } from '@/stores/Salary';
import { ref } from 'vue';
const currentSalary = salaryStore();

const checkOut = ref(currentSalary.checkOutSalary);
const extendStay = ref(currentSalary.extendSalary);

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
    } else {
        extendStay.value = Number(currentInputStr);
        currentSalary.setExtendSalary(Number(currentInputStr));
    }
};

const clearNumber = () => {
    currentInputStr = '';
};
const reShowNumber = () => {
    if (currentEdit === 'checkOut') {
        currentInputStr = checkOut.value + '';
    } else {
        currentInputStr = extendStay.value + '';
    }
};

const clearStore = () => {
    currentSalary.clear();
};
const resetStore = () => {
    currentSalary.reset();
    checkOut.value = 0;
    extendStay.value = 0;
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