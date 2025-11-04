/*!
* Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
*/
// Highlights current date on contact page
window.addEventListener('DOMContentLoaded', event => {
    const listHoursArray = document.body.querySelectorAll('.list-hours li');

    // CORRECCIÓN: Comprueba que el elemento exista antes de intentar acceder a su clase
    const todayIndex = new Date().getDay();

    if (listHoursArray.length > todayIndex) {
        listHoursArray[todayIndex].classList.add('today');
    }
})
