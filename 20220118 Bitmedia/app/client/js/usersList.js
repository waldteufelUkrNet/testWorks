'use strict';
// userList.js
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ VARIABLES ↓↓↓ */
/* ↑↑↑ /VARIABLES ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ EVENT LISTENERS ↓↓↓ */
  document.addEventListener('click', clickHandler);
/* ↑↑↑ /EVENT LISTENERS ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ FUNCTIONS DECLARATION ↓↓↓ */
  function clickHandler(event) {
    if ( event.target.closest('tbody tr') ) {
      const id = event.target.closest('tbody tr')
                             .querySelector('td')
                             .innerHTML;
      if(id) {
        // go to users page (пример роута /user/:id)
      }
    }
  }
/* ↑↑↑ /FUNCTIONS DECLARATION ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////