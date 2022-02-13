'use strict';
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ VARIABLES ↓↓↓ */
  const MONTH_ARR           = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        MONTH_ARR_FULL      = ['January','February','March','April','May','June','July','August','September','October','November','Decemder'],
        WEEK_IN_MILISECONDS = 604800000;
/* ↑↑↑ /VARIABLES ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ EVENT HANDLERS ↓↓↓ */
  document.addEventListener('click', clickHandler);
  document.addEventListener('DOMContentLoaded', ready);
/* ↑↑↑ /EVENT HANDLERS ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ FUNCTIONS DECLARATION ↓↓↓ */

  function ready() {
    const datepicker = document.querySelector('.datepicker');
    if ( datepicker ) {
      setDatepickerRange(datepicker);
    }
  }

  function clickHandler(event) {
    if ( event.target.closest('.datepicker') ) {
      handleCalenderClicks(event);
    }

    if ( !event.target.closest('.datepicker')
         && document.querySelector('.datepicker__calender_active') ) {
      const datepicker = document.querySelector('.datepicker__calender_active')
                                 .closest('.datepicker');
      toggleCalender(datepicker);
    }
  }

  function handleCalenderClicks(event) {
    const datepicker = event.target.closest('.datepicker');

    if ( event.target.closest('.datepicker__panel .datepicker__input-wrapper') ) {
      toggleCalender(datepicker);
    }

    if ( event.target.closest('[data-role="toggleList"]') ) {
      const calenderListInstance = event.target.closest('.datepicker__list-instance');
      toggleCalenderList(calenderListInstance);
    }

    if ( !event.target.closest('[data-role="toggleList"]')
         && document.querySelector('.datepicker__list_active') ) {
      const calenderListInstance = document.querySelector('.datepicker__list_active')
                                           .closest('.datepicker__list-instance');
      toggleCalenderList(calenderListInstance);
    }

    if ( event.target.closest('.datepicker__list-el') ) {
      selectListItem( datepicker, event.target.closest('.datepicker__list-el') );
    }

    if ( event.target.closest('.datepicker__day') ) {
      selectRange( datepicker, event.target.closest('.datepicker__day') );
    }
    if (event.target.closest('button.datepicker__btn[type="button"][data-role="cancel"]')) {
      toggleCalender(datepicker);
    }

    if (event.target.closest('button.datepicker__btn[type="button"][data-role="apply"]')) {
      applyNewRange(datepicker);
    }
  }

  function setDatepickerRange(datepicker, start, finish) {

    const finishDate     = finish || new Date(),
          finishDay      = finishDate.getDate(),
          finishMonth    = finishDate.getMonth(),
          finishMonthStr = MONTH_ARR[finishMonth],
          finishYear     = finishDate.getFullYear(),

          startDate      = start || new Date(finishDate - WEEK_IN_MILISECONDS),
          startDay       = startDate.getDate(),
          startMonth     = startDate.getMonth(),
          startMonthStr  = MONTH_ARR[startMonth],
          startYear      = startDate.getFullYear();

    const startDateStr   = `${startYear}-${startMonth+1}-${startDay}`,
          finishDateStr  = `${finishYear}-${finishMonth+1}-${finishDay}`,
          fulldateString = `${startMonthStr} ${startDay}, ${startYear} - ${finishMonthStr} ${finishDay}, ${finishYear}`;

    datepicker.querySelector('.datepicker__input').value = fulldateString;
    datepicker.setAttribute('data-startvalue', startDateStr);
    datepicker.setAttribute('data-finishvalue', finishDateStr);
  }

  function toggleCalender(datepicker) {
    datepicker.querySelector('.datepicker__calender')
              .classList.toggle('datepicker__calender_active');

    if ( document.querySelector('.datepicker__calender_active') ) {
      // now it's open, build calender
      const startValue     = datepicker.dataset.startvalue,
            finishValue    = datepicker.dataset.finishvalue,
            startDate      = new Date(startValue),
            finishDate     = new Date(finishValue),
            startYear      = startValue.slice(0,4),
            startMonthStr  = MONTH_ARR_FULL[ startDate.getMonth() ],
            finishYear     = finishValue.slice(0,4),
            finishMonthStr = MONTH_ARR_FULL[ finishDate.getMonth() ];

      datepicker.querySelector('.datepicker__calender-col[data-role="start"] .datepicker__list-instance[data-role="month"] .datepicker__list-result')
                .innerHTML = startMonthStr;
      datepicker.querySelector('.datepicker__calender-col[data-role="finish"] .datepicker__list-instance[data-role="month"] .datepicker__list-result')
                .innerHTML = finishMonthStr;
      datepicker.querySelector('.datepicker__calender-col[data-role="start"] .datepicker__list-instance[data-role="year"] .datepicker__list-result')
                .innerHTML = startYear;
      datepicker.querySelector('.datepicker__calender-col[data-role="finish"] .datepicker__list-instance[data-role="year"] .datepicker__list-result')
                .innerHTML = finishYear;

      const startMonthHTML = buildMonth(startDate);
      datepicker.querySelector('.datepicker__calender-col[data-role="start"] .datepicker__week-names')
                .insertAdjacentHTML('afterEnd', startMonthHTML);

      const finishMonthHTML = buildMonth(finishDate);
      datepicker.querySelector('.datepicker__calender-col[data-role="finish"] .datepicker__week-names')
                .insertAdjacentHTML('afterEnd', finishMonthHTML);

      showRange(datepicker);
    } else {
      closeCalender(datepicker);
    }
  }

  function toggleCalenderList(calenderListInstance) {
    const list       = calenderListInstance.querySelector('ul.datepicker__list'),
          openedList = document.querySelector('.datepicker__list_active');

    if (openedList && list !== openedList) {
      openedList.classList.remove('datepicker__list_active');
    }

    list.classList.toggle('datepicker__list_active');
  }

  function getNumberOfDaysInMonth(date) {
    date.setMonth( date.getMonth() + 1 );
    const lastDayInMonth = new Date( date.setDate(0) );
    const daysAmount = lastDayInMonth.getDate();

    return daysAmount;
  }

  function closeCalender(datepicker) {
    datepicker.querySelectorAll('.datepicker__list-result').forEach( item => {
     item.innerHTML = '';
    });
    datepicker.querySelectorAll('.datepicker__week').forEach( item => {
     item.remove();
    });
    const applyBtn = datepicker.querySelector('.datepicker__btn[data-role="apply"]');
    applyBtn.removeAttribute('data-startvalue');
    applyBtn.removeAttribute('data-finishvalue');
  }

  function buildMonth(date) {
    const firstDayWeekDay     = (new Date( date.setDate(1) )).getDay(),
          daysAmount          = getNumberOfDaysInMonth(date),
          prevMonthDate       = new Date( date.setMonth(date.getMonth() - 2) ),
          prevMonthDaysAmount = getNumberOfDaysInMonth(prevMonthDate);

    let monthHTML = '';
    const daysArr = [];

    if (firstDayWeekDay !== 0) {
      // 1-ше число місяця - не понеділок, отже в першому тижні будуть дні з
      // попереднього місяця
      const prevMonthMonday = prevMonthDaysAmount - firstDayWeekDay + 1;
      for (let i = prevMonthMonday; i < prevMonthDaysAmount+1; i++ ) {
        daysArr.push(i);
      }
    }

    for (let i = 1; i < daysAmount+1; i++) {
      daysArr.push(i);
    }

    let count = 0;
    while(daysArr.length%7 != 0) {
      daysArr.push(++count);
    }

    let weeksCount   = 0,
        currentMonth = false;
    for (let i = 0; i < daysArr.length; i++) {
      weeksCount++;

      if (daysArr[i] == 1 && currentMonth == true) {
        currentMonth = false;
      } else if (daysArr[i] == 1) {
        currentMonth = true;
      }

      if (weeksCount == 1) {
        monthHTML += '<div class="datepicker__week"><div class="datepicker__day datepicker__day_first';
        if (currentMonth) {
          monthHTML += '">' + daysArr[i] + '</div>';
        } else {
          monthHTML += ' datepicker__day_passive">' + daysArr[i] + '</div>';
        }
      } else if (weeksCount == 7) {
        monthHTML += '<div class="datepicker__day datepicker__day_last';
        if (currentMonth) {
          monthHTML += '">' + daysArr[i] + '</div></div>';
        } else {
          monthHTML += ' datepicker__day_passive">' + daysArr[i] + '</div></div>';
        }
        weeksCount = 0;
      } else {
        monthHTML += '<div class="datepicker__day';
        if (currentMonth) {
          monthHTML += '">' + daysArr[i] + '</div>';
        } else {
          monthHTML += ' datepicker__day_passive">' + daysArr[i] + '</div>';
        }
      }
    }
    return monthHTML;
  }

  function selectListItem(datepicker, item) {
    const value              = item.innerHTML,
          instance           = item.closest('.datepicker__list-instance'),
          resultField        = instance.querySelector('.datepicker__list-result'),
          calenderColumn     = instance.closest('.datepicker__calender-col'),
          calenderColumnType = calenderColumn.dataset.role,
          date               = datepicker.dataset[`${calenderColumnType}value`];

    resultField.innerHTML = value;

    let newDateStr = '';
    if( +value ) {
      // year
      newDateStr = value + date.slice(4);
    } else {
      // month
      let monthNumber = getMonthNumber(value);
      newDateStr = date.replace(/-\d+-/iu, '-' + monthNumber + '-');
    }

    // datepicker.setAttribute(`data-${calenderColumnType}value`, newDateStr);

    const monthHTML = buildMonth( new Date(newDateStr) );
    if ( calenderColumn.querySelector('.datepicker__week') ) {
      const weeksArr = calenderColumn.querySelectorAll('.datepicker__week');
      weeksArr.forEach( week => week.remove() );
    }
    calenderColumn.querySelector('.datepicker__week-names')
                  .insertAdjacentHTML('afterEnd', monthHTML);

    if(date == newDateStr) {
      showRange(datepicker);
    }
  }

  function showRange(datepicker, start, finish) {
    const startDateStr  = start || datepicker.dataset.startvalue,
          finishDateStr = finish || datepicker.dataset.finishvalue,
          startDate     = new Date(startDateStr),
          startYear     = startDate.getFullYear(),
          startMonth    = startDate.getMonth(),
          startDay      = startDate.getDate(),
          finishDate    = new Date(finishDateStr),
          finishYear    = finishDate.getFullYear(),
          finishMonth   = finishDate.getMonth(),
          finishDay     = finishDate.getDate();

    if (startDate > finishDate) {
      // тут ще треба продумати поведінку
      removeRange(datepicker);
      // setDatepickerRange(datepicker)
      return;
    }

    if ( startMonth == finishMonth && startYear == finishYear ) {
      // the range is completely located in one month
      const startColumn = datepicker.querySelector('.datepicker__calender-col[data-role="start"]'),
            days        = startColumn.querySelectorAll('.datepicker__day');

      days.forEach( (day, dayI) => {
        if ( !day.classList.contains('datepicker__day_passive')
             && day.innerHTML == startDay) {
          day.classList.add('datepicker__day_start-range');
        }
        if ( !day.classList.contains('datepicker__day_passive')
             && day.innerHTML == finishDay) {
          day.classList.add('datepicker__day_end-range');
        }
        if ( !day.classList.contains('datepicker__day_passive')
             && day.innerHTML > startDay
             && day.innerHTML < finishDay) {
          day.classList.add('datepicker__day_range');
        }

        if ( (startDay == 1 && dayI > 0)
             || (startDay != 1 && day.innerHTML == startDay - 1 ) ) {
          day.classList.add('datepicker__day_before-range');
        }
        if ( (day.innerHTML - 1 == finishDay && !day.classList.contains('datepicker__day_passive'))
             || (day.innerHTML == 1 && day.classList.contains('datepicker__day_passive')) ) {
          day.classList.add('datepicker__day_after-range');
        }
      });
    } else {
      const startColumn  = datepicker.querySelector('.datepicker__calender-col[data-role="start"]'),
            startDays    = startColumn.querySelectorAll('.datepicker__day'),
            finishColumn = datepicker.querySelector('.datepicker__calender-col[data-role="finish"]'),
            finishDays   = finishColumn.querySelectorAll('.datepicker__day'),
            startMonth   = startColumn.querySelector('.datepicker__list-instance[data-role="month"] .datepicker__list-result').innerHTML,
            startYear    = startColumn.querySelector('.datepicker__list-instance[data-role="year"] .datepicker__list-result').innerHTML,
            finishMonth  = finishColumn.querySelector('.datepicker__list-instance[data-role="month"] .datepicker__list-result').innerHTML,
            finishYear   = finishColumn.querySelector('.datepicker__list-instance[data-role="year"] .datepicker__list-result').innerHTML;

      const startYearFromStr  = startDateStr.slice(0,4),
            startMonthFromStr = startDateStr.split('-',2)[1];
      let startMonthNumber = getMonthNumber(startMonth);

      if(startYearFromStr == startYear && startMonthFromStr == startMonthNumber) {
        let maxStartI = 0;
        startDays.forEach( (day, dayI) => {
          if ( !day.classList.contains('datepicker__day_passive') ) {
            maxStartI = dayI;
          }
        });
        startDays.forEach( (day, dayI) => {
          if ( day.innerHTML == startDay
               && !day.classList.contains('datepicker__day_passive')) {
            day.classList.add('datepicker__day_start-range');
          }
          if ( day.innerHTML > startDay
               && !day.classList.contains('datepicker__day_passive')) {
            day.classList.add('datepicker__day_range');
          }
          if ( dayI > maxStartI
               && day.classList.contains('datepicker__day_passive')) {
            day.classList.add('datepicker__day_range');
          }
        });
      }

      const finishYearFromStr  = finishDateStr.slice(0,4),
            finishMonthFromStr = finishDateStr.split('-',2)[1];
      let finishMonthNumber = getMonthNumber(finishMonth);

      if(finishYearFromStr == finishYear && finishMonthFromStr == finishMonthNumber) {
        let minFinishI = 0;
        finishDays.forEach( (day, dayI) => {
          if ( !day.classList.contains('datepicker__day_passive') && day.innerHTML == 1 ) {
            minFinishI = dayI;
          }
        });
        finishDays.forEach( (day, dayI) => {
          if ( day.innerHTML == finishDay
               && !day.classList.contains('datepicker__day_passive')) {
            day.classList.add('datepicker__day_end-range');
          }
          if ( day.innerHTML < finishDay
               && !day.classList.contains('datepicker__day_passive')) {
            day.classList.add('datepicker__day_range');
          }
          if ( dayI < minFinishI
               && day.classList.contains('datepicker__day_passive')) {
            day.classList.add('datepicker__day_range');
          }
        });
      }
    }
  }

  function removeRange(datepicker) {
    const daysArr = datepicker.querySelectorAll('.datepicker__day');
    daysArr.forEach( day => {
      day.classList.remove('datepicker__day_before-range');
      day.classList.remove('datepicker__day_start-range');
      day.classList.remove('datepicker__day_range');
      day.classList.remove('datepicker__day_end-range');
      day.classList.remove('datepicker__day_after-range');
    } );
  }

  function selectRange(datepicker, day) {
    const calencerColumn = day.closest('.datepicker__calender-col'),
          newDay         = day.innerHTML,
          newMonthStr    = calencerColumn.querySelector('.datepicker__list-instance[data-role="month"] .datepicker__list-result').innerHTML,
          newYear        = calencerColumn.querySelector('.datepicker__list-instance[data-role="year"] .datepicker__list-result').innerHTML,
          applyBtn       = datepicker.querySelector('.datepicker__btn[data-role="apply"]');

    const newMonth = getMonthNumber(newMonthStr);
    const newDateStr = `${newYear}-${newMonth}-${newDay}`;

    let startDateStr, finishDateStr;
    startDateStr = applyBtn.dataset.startvalue;
    if (!startDateStr) {
      startDateStr = newDateStr;
      applyBtn.setAttribute('data-startvalue', startDateStr);
    } else {
      finishDateStr = newDateStr;
      applyBtn.setAttribute('data-finishvalue', finishDateStr);

      if( new Date(finishDateStr) < new Date(startDateStr) ) {
        finishDateStr = startDateStr;
        startDateStr = newDateStr;
        applyBtn.setAttribute('data-startvalue', startDateStr);
        applyBtn.setAttribute('data-finishvalue', finishDateStr);
      }

      removeRange(datepicker);
      showRange(datepicker, startDateStr, finishDateStr);
    }
  }

  function getMonthNumber(monthName) {
    let monthNumber;
    for (let i = 0; i < MONTH_ARR_FULL.length; i++) {
      if ( MONTH_ARR_FULL[i] == monthName ) {
        monthNumber = i + 1;
        break;
      }
    }
    return monthNumber;
  }

  function applyNewRange(datepicker) {
    const applyBtn      = datepicker.querySelector('.datepicker__btn[data-role="apply"]'),
          startDateStr  = applyBtn.dataset.startvalue,
          finishDateStr = applyBtn.dataset.finishvalue;

    if (!startDateStr || !finishDateStr) return;

    datepicker.setAttribute('data-startvalue', startDateStr);
    datepicker.setAttribute('data-finishvalue', finishDateStr);

    setDatepickerRange( datepicker, new Date(startDateStr), new Date(finishDateStr) );

    toggleCalender(datepicker);
  }
/* ↑↑↑ /FUNCTIONS DECLARATION ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////