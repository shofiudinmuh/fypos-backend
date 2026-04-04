export const addDays = (date: Date, days: number): Date => {
    const result = new Date();
    result.setDate(result.getDate() + days);

    return result;
};
