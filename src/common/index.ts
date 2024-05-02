export interface SalaryState {
    date: string;
    salary: number;
}

export const calculateDateSort = (date: string) => {
    const parts = date.split('年').join('-').split('月').join('-').split('日').join('').split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}