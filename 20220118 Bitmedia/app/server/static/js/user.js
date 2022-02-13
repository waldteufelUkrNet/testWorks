'use strict';
// user.js
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ VARIABLES ↓↓↓ */
/* ↑↑↑ /VARIABLES ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ EVENT LISTENERS ↓↓↓ */
  document.addEventListener('click', clickHandler);
  document.addEventListener('DOMContentLoaded', ready);
/* ↑↑↑ /EVENT LISTENERS ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ FUNCTIONS DECLARATION ↓↓↓ */
  async function ready() {
    let userID = localStorage.getItem('AppCo-userID');

    const endDate      = new Date(),
          startDate    = new Date( endDate - 7*24*60*60*1000),
          endDateStr   = getDateString(endDate),
          startDateStr = getDateString(startDate);

    const datepicker = document.querySelector('.datepicker');
    setDatepickerRange(datepicker, new Date(startDate), new Date(endDate));

    let responseResult = await loadUserData(userID, startDateStr, endDateStr);

    document.querySelector('.h1AndDadepickerWrapper h1').innerHTML = responseResult.username;
    document.querySelector('span.breadcrumbs__page').innerHTML = responseResult.username;

    drawCharts(responseResult.data, startDateStr, endDateStr);
  }

  async function clickHandler(event) {
    if (event.target.closest('button.datepicker__btn[type="button"][data-role="apply"]')) {

      let userID = localStorage.getItem('AppCo-userID');

      const datepicker    = event.target.closest('.datepicker'),
            startDateStr  = getDateString(new Date(datepicker.dataset.startvalue) ),
            finishDateStr = getDateString(new Date(datepicker.dataset.finishvalue) );

      const responseResult = await loadUserData(userID, startDateStr, finishDateStr);
      if(responseResult) {
        drawCharts(responseResult.data, startDateStr, finishDateStr);
      }
    }
  }

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
      return await dataResponse.json();
    } else {
      console.log('load userdata error');
    }
  }

  function drawCharts(data, startDateStr, endDateStr) {

    document.querySelector('#clicksGraphic').innerHTML = '';
    document.querySelector('#viewsGraphic').innerHTML = '';

    let clicksChartData = [];
    let viewsChartData = [];

    if (!data || !data.length) {
      let startDate = new Date(startDateStr),
          endDate   = new Date(endDateStr),
          startMS   = +startDate,
          endMS     = +endDate;

      while ( startMS < endMS + 24*60*60*1000 ) {
        clicksChartData.push({
          x: getDateString(startDate),
          value: 0
        });
        viewsChartData.push({
          x: getDateString(startDate),
          value: 0
        });
        startMS += 24*60*60*1000;
        startDate = new Date(startMS);
      }
    } else {
      data.forEach( item => {
        clicksChartData.push({
          x: item.date,
          value: item.clicks
        });
        viewsChartData.push({
          x: item.date,
          value: item.page_views
        });
      });
    }

    let markerStyle = {enabled:true, type:'circle', fill:'#3A80BA', size:7};

    clicksChartData[0].marker = markerStyle;
    clicksChartData[clicksChartData.length - 1].marker = markerStyle;
    viewsChartData[0].marker = markerStyle;
    viewsChartData[clicksChartData.length - 1].marker = markerStyle;

    // create 1 chart
    let chart = anychart.line();
    let xAxis = chart.xAxis();
    let yAxis = chart.yAxis();
    let series = chart.spline(clicksChartData);
    series.stroke('4 #3A80BA');

    chart.yGrid().enabled(true).stroke('#f1f1f1');
    yAxis.enabled(true).stroke('transparent');
    yAxis.labels().enabled(true).fontColor('#cccccc');
    yAxis.ticks({stroke: '#f1f1f1'});

    xAxis.enabled(true).stroke('#f1f1f1');
    xAxis.labels().enabled(true).fontColor('#cccccc');
    xAxis.ticks({stroke: 'transparent'});

    let stage = anychart.graphics.create();
    stage.container("clicksGraphic");
    chart.container(stage);

    stage.listen("renderfinish", () => {
      document.getElementsByClassName('anychart-credits')[0].remove();
      let container = document.querySelector('#clicksGraphic');
      let height = container.offsetHeight;
      container.style.height = height + 'px';
    });

    chart.draw();

    // create 2 chart
    let chart2 = anychart.line();
    let xAxis2 = chart2.xAxis();
    let yAxis2 = chart2.yAxis();
    let series2 = chart2.spline(viewsChartData);
    series2.stroke('4 #3A80BA');

    chart2.yGrid().enabled(true).stroke('#f1f1f1');
    yAxis2.enabled(true).stroke('transparent');
    yAxis2.labels().enabled(true).fontColor('#cccccc');
    yAxis2.ticks({stroke: '#f1f1f1'});

    xAxis2.enabled(true).stroke('#f1f1f1');
    xAxis2.labels().enabled(true).fontColor('#cccccc');
    xAxis2.ticks({stroke: 'transparent'});

    let stage2 = anychart.graphics.create();
    stage2.container("viewsGraphic");
    chart2.container(stage2);

    stage2.listen("renderfinish", () => {
      document.getElementsByClassName('anychart-credits')[0].remove();
      let container = document.querySelector('#viewsGraphic');
      let height = container.offsetHeight;
      container.style.height = height + 'px';
    });

    chart2.draw();
  }

  function getDateString(dateObj) {
    const year  = dateObj.getFullYear();

    let   month = dateObj.getMonth() + 1,
          day   = dateObj.getDate();

    if ( month < 10) month = '0' + month;
    if ( day < 10) day = '0' + day;

    return `${year}-${month}-${day}`;
  }
/* ↑↑↑ /FUNCTIONS DECLARATION ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////