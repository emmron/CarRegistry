/**
 * Generates a date string that is a specified number of days from today
 * @param days - Number of days from today (positive for future, negative for past)
 * @returns ISO date string
 */
export function generateDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
} 