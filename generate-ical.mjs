import fs from "fs";
import { readFileSync } from "fs";
import { specificDayOfMonth } from "./common.mjs";

const daysData = JSON.parse(readFileSync(new URL("./days.json", import.meta.url), "utf-8"));

const formatDateToICS = (date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

const generateEvent = (year, event) => {
    const eventDate = specificDayOfMonth(
        year, event.monthName, event.dayName, event.occurrence ?? 1
    );

    if (!eventDate) {
        console.warn(`Skipping event "${event.name}" due to invalid date.`);
        return ""; // Skip invalid events
    }

    return `BEGIN:VEVENT\n` +
           `DTSTAMP:${formatDateToICS(new Date())}\n` +
           `DTSTART;VALUE=DATE:${eventDate.toISOString().split("T")[0].replace(/-/g, "")}\n` +
           `SUMMARY:${event.name}\n` +
           `END:VEVENT\n\n`;
};

// Start the iCal file with a single VCALENDAR block
let icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//My Calendar//EN\n`;

for (let year = 2020; year <= 2030; year++) {
    daysData.forEach(event => {
        icsData += generateEvent(year, event);
    });
}

// End the iCal file properly
icsData += `END:VCALENDAR`;

const outputFile = "generate-ical.ics";
fs.writeFileSync(outputFile, icsData);
console.log(`✅ iCal file generated successfully: ${outputFile}`);
