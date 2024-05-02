import { defineStore } from 'pinia';
import { SalaryState, calculateDateSort } from "@/common";
import { reactive } from 'vue';


export const salaryStore = defineStore('salary', {
    state: () => {
        return {
            checkOutNum: 0,
            extendNum: 0,
            checkOutSalary: 0,
            extendSalary: 0,
            daySalaryList: reactive([] as SalaryState[])
        }
    },
    actions: {
        setCheckOutNum(checkOutNum: number) {
            this.checkOutNum = checkOutNum
        },
        setExtendNum(extendNum: number) {
            this.extendNum = extendNum
        },
        setCheckOutSalary(checkOutSalary: number) {
            this.checkOutSalary = checkOutSalary
        },
        setExtendSalary(extendSalary: number) {
            this.extendSalary = extendSalary
        },
        addDaySalary(daySalary: SalaryState) {
            // 如果存在相同的数据，则保留最新的数据
            const index = this.daySalaryList.findIndex(item => item.date === daySalary.date)
            if (index !== -1) {
                this.daySalaryList.splice(index, 1, daySalary)
            } else {
                this.daySalaryList.push(daySalary)
            }
            // 按日期排序
            this.daySalaryList.sort((a, b) => {
                return calculateDateSort(a.date) < calculateDateSort(b.date) ? 1 : -1
            })
        },
        deleteDaySalary(date: string) {
            // 删除指定日期的数据
            const index = this.daySalaryList.findIndex(item => item.date === date)
            if (index !== -1) {
                this.daySalaryList.splice(index, 1)
            }
        },
        clear() {
            this.checkOutNum = 0
            this.extendNum = 0
            this.daySalaryList = reactive([])
        },
        reset() {
            this.checkOutSalary = 0
            this.extendSalary = 0
        },
        resetTotal() {
            this.checkOutNum = 0
            this.extendNum = 0
        }
    },
    persist: {
        key: 'salary',
        storage: localStorage,
        paths: ['checkOutNum', 'extendNum', 'checkOutSalary', 'extendSalary', 'daySalaryList']
    }

})
