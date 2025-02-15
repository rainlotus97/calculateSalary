export interface SalaryState {
    date: string;
    salary: number;
    extraPrice: number;
    salaryFuncList: SalaryItem[];
}

// 根据字符串转化为日期进行排序
export const calculateDateSort = (date: string) => {
    const parts = date.split('年').join('-').split('月').join('-').split('日').join('').split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

export const getCurrentTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} 年 ${month} 月 ${day} 日`;
};

export interface SalaryItem {
    title: string;
    key: string;
    value: number;
    count: number;
    inputStr: string;
    color: string;
}

// 打扫状态
export interface RoomCleanState {
    // 房间状态
    roomState: string | 'NONE';
    // 打扫状态
    cleanState: string | '默认';
    // 房间颜色
    roomColor: string;
}

// 房间信息
export interface RoomInfo {
    // 房间号
    roomNumber: string;
    // 房间状态
    roomCleanState: RoomCleanState;
}

// 定义一些固定颜色
export const roomColorList: string[] = ['#95a5a6', '#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6', '#34495e', '#1abc9c', '#f39c12', '#d35400', '#c0392b', '#7f8c8d']


export interface TimeType {
    text: string;
    select: boolean;
}