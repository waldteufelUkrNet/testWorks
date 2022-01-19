$( function() {
  $( '#datepicker' ).datepicker({
    showOtherMonths: true,
    selectOtherMonths: true,
    showAnim: 'clip',
    changeMonth: true,
    changeYear: true,
    numberOfMonths: 2,
    showButtonPanel: true,
    buttonImage: "images/calendar.gif",
    buttonImageOnly: true,
    buttonText: "Select date"
  });
} );