import { defineStore } from 'pinia';
import { RoomInfo, SalaryItem, SalaryState, calculateDateSort } from "@/common";
import { reactive } from 'vue';


export const salaryStore = defineStore('salary', {
    state: () => {
        return {
            daySalaryList: reactive([] as SalaryState[]),
            date: '',
            salaryFuncList: reactive([] as SalaryItem[]),
            roomList: reactive([] as RoomInfo[]),
        }
    },
    actions: {
        addDaySalary(daySalary: SalaryState) {
            // 如果存在相同的数据，则保留最新的数据
            const index = this.daySalaryList.findIndex(item => item.date.trim() === daySalary.date.trim())
            console.log('current daySalaryList in list index is: ', index);
            if (index !== -1) {
                if (daySalary.salary === 0) {
                    this.daySalaryList.splice(index, 1)
                } else {
                    this.daySalaryList.splice(index, 1, daySalary)
                }
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
            const index = this.daySalaryList.findIndex(item => item.date.trim() === date.trim())
            if (index !== -1) {
                this.daySalaryList.splice(index, 1)
            }
        },
        addSalaryFunc(salaryFunc: SalaryItem) {
            const index = this.salaryFuncList.findIndex(item => item.key === salaryFunc.key)
            if (index !== -1) {
                this.salaryFuncList.splice(index, 1, salaryFunc)
            } else {
                this.salaryFuncList.push(salaryFunc)
            }
        },
        deleteSalaryFunc(key: string) {
            const index = this.salaryFuncList.findIndex(item => item.key === key)
            if (index !== -1) {
                this.salaryFuncList.splice(index, 1)
            }
        },
        clear() { this.daySalaryList = [] },
        setDate(date: string) {
            this.date = date
        },
        setSalaryList(salaryList: SalaryState[]) {
            this.daySalaryList = salaryList
        },
        setDaySalaryList(daySalaryList: SalaryState[]) {
            this.daySalaryList = daySalaryList
        },
        setRoomList(roomList: RoomInfo[]) {
            this.roomList = roomList
        },
        syncFuncList(roomInfoList: RoomInfo[]) {
            this.salaryFuncList.forEach(item => {
                // 计算当前功能的数量
                let sumCount = 0
                roomInfoList.forEach((roomInfo: RoomInfo) => {
                    if (roomInfo.roomCleanState.roomState === item.key) {
                        sumCount++
                    }
                })
                item.count = sumCount;
            })
        }
    },
    persist: {
        key: 'salary',
        storage: localStorage,
        paths: ['daySalaryList', 'date', 'salaryFuncList', 'roomList']
    }

})
