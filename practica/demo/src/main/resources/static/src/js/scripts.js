window.addEventListener('DOMContentLoaded', event => {
    const listHoursArray = document.body.querySelectorAll('.list-hours li');
    const todayIndex = new Date().getDay();

    if (listHoursArray[todayIndex]) {
        listHoursArray[todayIndex].classList.add('today');
    }
});
