function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function eventMonthYear(dateString) {
    var date = new Date(parseInt(dateString));
    return(
        [
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getFullYear()),
        ].join('-')
        );
}

module.exports = {eventMonthYear};

/*function formatDate(date) {
    return(
        [ 
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getFullYear()),
        ].join('/') + ' ' +
        [
          padTo2Digits(date.getHours()),
          padTo2Digits(date.getMinutes()),
          padTo2Digits(date.getSeconds()),
        ].join(':')
        );
}*/


//const time1 = "1684509405000";
//console.log(formatDate(new Date(time1)));  // Output: 19/05/2023 16:16:45
//console.log(eventMonthYear(time1)); // Output: 05-2023
