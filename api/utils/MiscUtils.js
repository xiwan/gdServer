
exports.time = function() {
    return Date.now()/1000|0;
};

/**
 * make Date for Pacific Standard Time 
 */
exports.pstDate = function(year, month, date, hour, minutes, second) {
   if (_isSummorTime()) {
       return new Date(year + "/" + month + "/" + date + " " + hour + ":" + minutes + ":" + second + "+PDT");
   } else {
       return new Date(year + "/" + month + "/" + date + " " + hour + ":" + minutes + ":" + second + "+PST");
   }
};

/**
 * get last time for Pacific Standard Time 
 */
exports.lastTimeOfPSTDate = function(hour, minutes, second) {
   var date = new Date();
   var current = date.getTime();
   // make PST Date
   date = exports.pstDate(date.getFullYear(), (date.getMonth() + 1), date.getDate(), hour, minutes,second);

   // last time check
   while (current < date.getTime()) {
       date.setDate(date.getDate() - 1);
   }
   return date.getTime() / 1000;
};

exports.elapsedDayOfPSTDate = function(checkTime, hour, minutes, second) {
    var lastTime = exports.lastTimeOfPSTDate(hour, minutes, second);
    var elapsedDay = 0;
    if (checkTime < lastTime) {
        elapsedDay = Math.ceil((lastTime - checkTime) / (60*60*24));
    }
    return elapsedDay;
};

exports.getPvpTime = function() {
    // TODO: should fix to work fine timezone of server
    //       set timezone in config and use getTimezoneOffset
    // it regards as the previous day that is 2 hours of 0 o'clock
    var d = new Date(Date.now() - 17*60*60*1000 - 60*60*2*1000);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    return (d.getTime()+17*60*60*1000) / 1000|0;
};

exports.getPSTDate = function(second){
    var now = (second) ? new Date(second * 1000) : new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var offset = -8.0;
    return new Date(utc + (3600000 * offset));
};

