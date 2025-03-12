import days from "./days.json" with { type: "json" };
import { specificDayOfMonth } from "./common.mjs";

const displayMonth = document.getElementById('display-month');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const selectMonth = document.getElementById('select-month');
const selectYear = document.getElementById('select-year');
const displayDays = document.getElementById('display-days');

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const monthsOfTheYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const populateSelectors = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    for (let i = 1900; i < 2100; i++) {
        const yearOpt = document.createElement('option');
        yearOpt.textContent = i;
        yearOpt.value = i;
        selectYear.appendChild(yearOpt);
    }

    selectYear.value = currentYear;

    for (let j = 0; j < monthsOfTheYear.length; j++) {
        const monthOpt = document.createElement('option');
        monthOpt.textContent = monthsOfTheYear[j];
        monthOpt.value = monthsOfTheYear[j];
        selectMonth.appendChild(monthOpt)
    }

    selectMonth.selectedIndex = currentMonth;
}

const displayCalender = () => {
    const date = new Date();
    const selectedMonth = selectMonth.selectedIndex;
    const selectedYear = parseInt(selectYear.value) || date.getFullYear();

    date.setFullYear(selectedYear, selectedMonth);

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const numberOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const MonthsInWords = date.toLocaleString('en-us', {month: 'long'});
    const formattedDay = firstDay.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

   const gapToLeave = weekdays.indexOf(formattedDay.split(',')[0]);
   displayMonth.innerHTML = `${MonthsInWords}, ${selectedYear}`;

    displayDays.innerHTML = '';

   for (let i = 1; i <= gapToLeave + numberOfDays; i++) {
    const day = document.createElement('div');
    day.classList.add('day');

    if (i > gapToLeave) {
        let actualDay = i - gapToLeave;
        day.innerText = actualDay;
        
        const dayDate = new Date(selectedYear, date.getMonth(), actualDay);
        const dayName = weekdays[dayDate.getDay()];

        const event = days.find(event => {
            const eventDate = specificDayOfMonth(selectedYear, event.monthName, event.dayName, event.occurrence);
            return eventDate && eventDate.getDate() === actualDay && eventDate.getMonth() === date.getMonth();
        });
        

        if (event) {
            console.log(`Match found: ${event.name}`);
            day.classList.add('commemorative-day');
            day.title = event.name;
            day.innerHTML += `<br><small><i>${event.name}</i></small>`;
        } 

    }
    displayDays.appendChild(day);
   }
}


    nextBtn.addEventListener('click', () => {
        let nextMonth = monthsOfTheYear.indexOf(selectMonth.value) + 1;
        let currentDate = new Date();
    
        if (selectYear.value == 2099 && nextMonth > 11) {
            selectMonth.value = monthsOfTheYear[currentDate.getMonth()];
            selectYear.value = currentDate.getFullYear();
        } else {
            if (nextMonth <= 11) {
                selectMonth.value = monthsOfTheYear[nextMonth];
            } else {
                if (selectYear.value >= 2100) return;
                selectMonth.value = monthsOfTheYear[0];
                selectYear.value = parseInt(selectYear.value) + 1;
            }
        }

        displayCalender();
    });
    
prevBtn.addEventListener('click', () => {
    let prevMonth = monthsOfTheYear.indexOf(selectMonth.value) - 1;
    let currentDate = new Date();

    if (selectYear.value == 1900 && prevMonth < 0) {
        selectMonth.value = monthsOfTheYear[currentDate.getMonth()];
        selectYear.value = currentDate.getFullYear();
    } else {
        if (prevMonth >= 0) {
            selectMonth.value = monthsOfTheYear[prevMonth];
        } else {
            if (selectYear.value <= 1900) return;
            selectMonth.value = monthsOfTheYear[11];
            selectYear.value = parseInt(selectYear.value) - 1;
        }
    }

    displayCalender();
});


selectMonth.addEventListener('change', () => {
    
    displayCalender();
});

selectYear.addEventListener('change', () => {
    
    displayCalender();
});

window.onload = function() {
    populateSelectors();
    displayCalender();

}