/*
 * @Description: 
 * @Author: Wang Su
 * @Date: 2024-05-15 21:59:21
 * @LastEditors: Wang Su
 * @LastEditTime: 2024-05-15 21:59:22
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
}

