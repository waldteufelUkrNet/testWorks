'use strict';
// user.js
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ VARIABLES ↓↓↓ */
/* ↑↑↑ /VARIABLES ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ EVENT LISTENERS ↓↓↓ */
  // document.addEventListener('click', clickHandler);
  document.addEventListener('DOMContentLoaded', ready);
/* ↑↑↑ /EVENT LISTENERS ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ FUNCTIONS DECLARATION ↓↓↓ */
  function ready() {
    let userID = localStorage.getItem('AppCo-userID');


    const endDate      = new Date(),
          startDate    = new Date( endDate - 7*24*60*60*1000);

    const startYear  = startDate.getFullYear(),
          endYear    = endDate.getFullYear();
    let   startMonth = startDate.getMonth() + 1,
          endMonth   = endDate.getMonth() + 1,
          startDay   = startDate.getDate(),
          endDay     = endDate.getDate();

    if ( startMonth < 10) startMonth = '0' + startMonth;
    if ( endMonth < 10) endMonth = '0' + endMonth;
    if ( startDay < 10) startDay = '0' + startDay;
    if ( endDay < 10) endDay = '0' + endDay;

    const endDateStr   = `${startYear}-${startMonth}-${startDay}`,
          startDateStr = `${endYear}-${endMonth}-${endDay}`;

    loadUserData(userID, startDateStr, endDateStr);

    const datepicker = document.querySelector('.datepicker');
    setDatepickerRange(datepicker, new Date(startDate), new Date(endDate));

    // тут ще логіка anycharts
  }

  // function clickHandler(event) {
  //   if ( event.target.closest('tbody tr') ) {
  //     const userID = event.target.closest('tbody tr').dataset.userid;
  //     loadUserPage(userID);
  //   }
  //   if ( event.target.closest('.pagination') ) {
  //     paginationClicksHandler(event);
  //   }
  // }

  async function loadUserData(userID, startDate, endDate) {
    const dataResponse = await fetch('/users/user', {
      method: 'POST',
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userID, startDate, endDate})
    });

    if (dataResponse.status == 200) {
      const response = await dataResponse.json();

      document.querySelector('.h1AndDadepickerWrapper h1').innerHTML = response.username;
      document.querySelector('span.breadcrumbs__page').innerHTML = response.username;

      const datepicker = document.querySelector('.datepicker');
      setDatepickerRange(datepicker, new Date(response.startDate), new Date(response.endDate));
    } else {
      console.log('load userdata error');
    }
  }
/* ↑↑↑ /FUNCTIONS DECLARATION ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////

  // {
  //   date: '2019-10-29',
  //   clicks: 733,
  //   page_views: 447
  // },