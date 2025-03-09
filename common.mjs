export const specificDayOfMonth = (year, monthName, dayName, occurrence) => {
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayName);
    const occurrenceMap = {
        "first": 1,
        "second": 2,
        "third": 3,
        "fourth": 4,
        "fifth": 5
    };

    const occurrenceNum = occurrenceMap[occurrence];
    let count = 0;

    if (!(occurrence in occurrenceMap)) {
        return null;
    }

    // First, find the first occurrence of the day in the month
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    let firstOccurrenceDate = null;

    // Loop to find the first occurrence of the specified weekday in the month
    for (let day = 1; day <= 7; day++) {
        const date = new Date(year, monthIndex, day);
        if (date.getDay() === dayIndex) {
            firstOccurrenceDate = date;
            break;
        }
    }

    // If no match found, return null
    if (!firstOccurrenceDate) return null;

    // Calculate the correct date based on the occurrence (first, second, third, last, etc.)
    let targetDate = new Date(firstOccurrenceDate);
    
    // For "first", we do nothing as it's already the first occurrence
    if (occurrence === "first") {
        return targetDate;
    }

    // For other occurrences, add 7 days for each next occurrence
    targetDate.setDate(firstOccurrenceDate.getDate() + (occurrenceNum - 1) * 7);

    // If occurrence is "last", loop backward to find the last occurrence of the weekday
    if (occurrence === "last") {
        let lastMatchingDay = null;
        for (let day = 31; day >= 1; day--) {
            const date = new Date(year, monthIndex, day);
            if (date.getMonth() !== monthIndex) break; // If the month changes, stop the loop
            if (date.getDay() === dayIndex) {
                lastMatchingDay = date;
                break;
            }
        }
        return lastMatchingDay;
    }

    return targetDate;
}

