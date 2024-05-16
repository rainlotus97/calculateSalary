/*
 * @Description:
 * @Author: Wang Su
 * @Date: 2024-05-15 22:52:47
 * @LastEditors: sunguangyu
 * @LastEditTime: 2024-05-16 22:56:24
 */
import { showToast } from "vant";
import { salaryStore } from "@/stores/Salary";
import { getCurrentTime } from "@/utils/times";
import type { SalaryState } from "@/types/Salary";
import { ref } from "vue";
const useMineCalculateSalary = (
  currentInputStr: string,
) => {
  const currentSalary = ref(0);
  const currentSalaryStore = salaryStore();
  const checkOut = ref(currentSalaryStore.checkOutNum);
  const extendStay = ref(currentSalaryStore.extendNum);
  const currentEditVal=ref(currentSalaryStore.currentEdit)
  const onInput = (value: string) => {
    currentInputStr += value;
    if (currentEditVal.value === "checkOut") {
      checkOut.value = Number(currentInputStr);
      currentSalaryStore.setCheckOutNum(Number(currentInputStr));
    } else {
      extendStay.value = Number(currentInputStr);
      currentSalaryStore.setExtendNum(Number(currentInputStr));
    }
    console.log(currentEditVal.value);
  };
  const onDelete = () => {
    currentInputStr = currentInputStr.slice(0, -1);
    if (currentEditVal.value === "checkOut") {
      checkOut.value = Number(currentInputStr);
      currentSalaryStore.setCheckOutNum(Number(currentInputStr));
    } else {
      extendStay.value = Number(currentInputStr);
      currentSalaryStore.setExtendNum(Number(currentInputStr));
    }
  };
  const clearNumber = () => {
    currentInputStr = "";
    calculateSalary();
  };
  const reShowNumber = () => {
    if (currentEditVal.value === "checkOut") {
      currentInputStr = checkOut.value + "";
    } else {
      currentInputStr = extendStay.value + "";
    }
  };
  const calculateSalary = () => {
    const checkOutPrice = currentSalaryStore.checkOutSalary;
    const extendStayPrice = currentSalaryStore.extendSalary;
    if (checkOutPrice === 0 || extendStayPrice === 0) {
      showToast("请设置退房单价和续住单价");
      return;
    }
    if (checkOut.value === 0 && extendStay.value === 0) {
      console.log("没有记录工资，无需计算");
      return;
    }
    currentSalary.value =
      checkOut.value * checkOutPrice + extendStay.value * extendStayPrice;
    let daliySalary: SalaryState = {
      date: getCurrentTime(),
      salary: currentSalary.value,
      extraPrice: currentSalaryStore.foodPrice,
    };
    currentSalaryStore.addDaySalary(daliySalary);
  };
  return {
    currentSalaryStore,
    checkOut,
    extendStay,
    currentSalary,
    onInput,
    onDelete,
    reShowNumber,
    clearNumber,
    calculateSalary
  };
};

export default useMineCalculateSalary;