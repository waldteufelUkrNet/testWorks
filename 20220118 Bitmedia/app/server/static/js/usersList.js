'use strict';
// userList.js
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ VARIABLES ↓↓↓ */
  const USERS_PER_PAGE = 50;
  let totalUsersAmount = 0;
/* ↑↑↑ /VARIABLES ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ EVENT LISTENERS ↓↓↓ */
  document.addEventListener('click', clickHandler);
  document.addEventListener('DOMContentLoaded', ready);
/* ↑↑↑ /EVENT LISTENERS ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ FUNCTIONS DECLARATION ↓↓↓ */
  function ready() {
    loadTable();
  }

  function clickHandler(event) {
    if ( event.target.closest('tbody tr') ) {
      const userID = event.target.closest('tbody tr').dataset.userid;
      loadUserPage(userID);
    }
    if ( event.target.closest('.pagination') ) {
      paginationClicksHandler(event);
    }
  }

  function paginationClicksHandler(event) {
    const btns     = document.querySelectorAll('button[data-role="number"]'),
          prevBtn  = document.querySelector('button[data-role="prev"]'),
          nextBtn  = document.querySelector('button[data-role="next"]');
    if ( event.target.closest('button[data-role="number"]') ) {
      const btn        = event.target.closest('button[data-role="number"]'),
            pageNumber = btn.innerHTML;

      btns.forEach( function(btn){
        btn.classList.remove('pagination__button_active');
      });
      btn.classList.add('pagination__button_active');
      loadTable(pageNumber, USERS_PER_PAGE);
    }

    if ( event.target.closest('button[data-role="prev"]') ) {
      // zero-page don't exists
      if ( getActivePageNumber() == 1) return;

      const newPageNumber = getActivePageNumber() - 1;
      if ( getActivePageNumber() == getLeftPageNumber() ) {
        // redraw HTML
        let btnsHTML = '';
        let start = newPageNumber;
        for(let i = 0; i < btns.length; i++) {
          if (start == newPageNumber) {
            btnsHTML += '<button class="pagination__button pagination__button_active" data-role="number">' + start + '</button>';
          } else {
            btnsHTML += '<button class="pagination__button" data-role="number">' + start + '</button>';
          }
          start++;
        }
        Array.from(btns).forEach( item => { item.remove(); });
        prevBtn.insertAdjacentHTML('afterEnd' , btnsHTML);
      } else {
        // toggle active class
        getActivePage().classList.remove('pagination__button_active');

        const newPageBtn = Array.from(btns).find( item => item.innerHTML == newPageNumber );
        newPageBtn.classList.add('pagination__button_active');
      }

      if (getActivePageNumber() == 1) {
        prevBtn.classList.remove('pagination__button_active');
      }

      if ( getRightPageNumber() < totalUsersAmount/USERS_PER_PAGE ) {
        nextBtn.classList.add('pagination__button_active');
      }

      loadTable(newPageNumber, USERS_PER_PAGE);
    }

    if ( event.target.closest('button[data-role="next"]') ) {
      if ( getActivePageNumber() == totalUsersAmount/USERS_PER_PAGE ) return;

      const newPageNumber = getActivePageNumber() + 1;
      if ( getActivePageNumber() == getRightPageNumber() ) {
        // redraw HTML
        let btnsHTML = '';
        let start = newPageNumber - btns.length + 1;
        for(let i = 0; i < btns.length; i++) {
          if (start == newPageNumber) {
            btnsHTML += '<button class="pagination__button pagination__button_active" data-role="number">' + start + '</button>';
          } else {
            btnsHTML += '<button class="pagination__button" data-role="number">' + start + '</button>';
          }
          start++;
        }
        Array.from(btns).forEach( item => { item.remove(); });
        prevBtn.insertAdjacentHTML('afterEnd' , btnsHTML);
      } else {
        // toggle active class
        getActivePage().classList.remove('pagination__button_active');

        const newPageBtn = Array.from(btns).find( item => item.innerHTML == newPageNumber );
        newPageBtn.classList.add('pagination__button_active');
      }

      if (getActivePageNumber() == totalUsersAmount/USERS_PER_PAGE) {
        nextBtn.classList.remove('pagination__button_active');
      }

      if ( getLeftPageNumber() > 1 ) {
        prevBtn.classList.add('pagination__button_active');
      }

      loadTable(newPageNumber, USERS_PER_PAGE);
    }
  }

  function getActivePage() {
    return document.querySelector('.pagination__button.pagination__button_active[data-role="number"]');
  }

  function getActivePageNumber() {
    const btn = document.querySelector('.pagination__button.pagination__button_active[data-role="number"]');
    return +btn.innerHTML;
  }

  function getLeftPageNumber() {
    const btn = document.querySelector('button[data-role="number"]');
    return +btn.innerHTML;
  }

  function getRightPageNumber() {
    const btn = document.querySelector('button[data-role="next"]')
                        .previousElementSibling;
    return +btn.innerHTML;
  }

  async function loadUserPage(userID) {
    localStorage.setItem('AppCo-userID', userID);
    location.href = 'user.html';
  }

  async function loadTable(page = 1, amount = USERS_PER_PAGE) {
    const dataResponse = await fetch('/users', {
      method: 'POST',
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({page, amount})
    });

    if (dataResponse.status == 200) {
      const data = await dataResponse.json();
      totalUsersAmount = data[data.length - 1].length;
      if (data.length > 1) {
        const tableBody = document.querySelector('table.usersTable tbody');
        tableBody.innerHTML = '';
        for (let i = 0; i < data.length - 1; i++) {
          const user = data[i];
          const userHTML = '<tr data-userid="' + user.id + '">\
                              <td>' + user.id + '</td>\
                              <td>' + user.first_name + '</td>\
                              <td>' + user.last_name + '</td>\
                              <td>' + user.email + '</td>\
                              <td>' + user.gender + '</td>\
                              <td>' + user.ip_address + '</td>\
                              <td>' + user.total_clicks + '</td>\
                              <td>' + user.total_views + '</td>\
                            </tr>';
          tableBody.insertAdjacentHTML('beforeEnd', userHTML);
        }
      }
    } else {
      console.log('something went wrong with loading data');
    }
  }
/* ↑↑↑ /FUNCTIONS DECLARATION ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////