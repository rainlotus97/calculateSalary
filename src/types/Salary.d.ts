/*
 * @Description: 
 * @Author: Wang Su
 * @Date: 2024-05-15 21:59:21
 * @LastEditors: sunguangyu
 * @LastEditTime: 2024-05-16 22:54:42
 */
export interface SalaryState {
    date: string;
    salary: number;
    extraPrice: number;
} 

export interface SalaryStateInterface{
    checkOutNum: number,
    extendNum: number,
    checkOutSalary: number,
    extendSalary: number,
    foodPrice: number,
    daySalaryList: SalaryState[],
    date: string,
    currentEdit: string,
}

