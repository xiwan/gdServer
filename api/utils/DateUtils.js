/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * example:
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") > 2006-07-02 08:09:04.423 
 * (new Date()).Format("yyyy-M-d h:m:s.S")      > 2006-7-2 8:9:4.18 
 */
Date.prototype.Format = function (format) {
    var options = {
        "M+": this.getMonth() + 1,                   //Month
        "d+": this.getDate(),                        //Day
        "h+": this.getHours(),                       //Hour 
        "m+": this.getMinutes(),                     //Minute
        "s+": this.getSeconds(),                     //Second
        "q+": Math.floor((this.getMonth() + 3) / 3), //Quarter
        "S": this.getMilliseconds()                  //毫秒
    };
    
    if ( /(y+)/.test(format) ) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    
    for (var option in options) {
        if (new RegExp("(" + option + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (options[option]) : (("00" + options[option]).substr(("" + options[option]).length)));
        } 
    }
    
    return format;
};

/*
 * 将unix timestamp按format转化
 * 
 * @param {number} unixTimestamp - unix timestamp.
 * @param {string} format - yyyy-MM-dd hh:mm:ss.S.
 */
Date.formatUnixTimestamp = function(unixTimestamp, format) {
    unixTimestamp = parseInt(unixTimestamp);
    if (isNaN(unixTimestamp)) {
        throw 'Date#formatUnixTimestamp, unixTimestamp is invalid.'
    }
    
    unixTimestamp = unixTimestamp.toString().length == 13 ? unixTimestamp : unixTimestamp*1000;
    
    var date = new Date(unixTimestamp);
    format = format == undefined ? "yyyy-MM-dd hh:mm:ss" : format;
    return date.Format(format);
};

/**
 * 得到当月的天数
 * @returns {number}
 */
Date.prototype.daysInMonth = function() {
    var month = this.getMonth();    // 0~11
    var year = this.getFullYear();
    var nextMonth = month+1;        // 1~12 12 should be 0
    if (nextMonth >= 12) {
        nextMonth = 0;
        ++year;
    }
    var d = new Date(year, nextMonth, 0);
    return d.getDate();
};

/*
 * 每天的开始时间
 * 
 */
Date.prototype.beginningOfDay = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

/*
 * 每天的结束时间
 * 
 */
Date.prototype.endingOfDay = function() {
    var now = this.setDate(this.getDate() + 1);
    return new Date((new Date(now)).Format('yyyy-MM-dd ') + '00:00:00');
};

Date.prototype.daysFrom1970 = function() {
    var now = this.getTime();
    return Math.ceil(now / 1000 / 60 / 60 / 24);
};

/*
 * 计算2个时间之间经过了几个时间点
 * 
 * @param {number} startAt - start unix timestamp, 1385554144000.
 * @param {number} time - 时间点, 190000(19:00:00).
 * @param {number} endAt - end unix timestamp, 1385554144000, default is now.
 */
Date.countBetweenTimes = function(startAt, time, endAt) {
    startAt = parseInt(startAt);
    time = parseInt(time);
    
    if (isNaN(startAt) || isNaN(time) || time.toString().length != 6) {
        throw 'Date#countBetweenTimes, startAt or time is invalid.' + time.toString().length;
    }
    
    var startDate = new Date(startAt);
    endAt = endAt || (new Date().getTime());
    var endDate = new Date(endAt);
    
    if (startAt >= endAt) {
        throw 'Date#countBetweenTimes, startAt should less than endAt.'
    }
    
    // The number of milliseconds in one day
    var ondDayInms = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var startDate = new Date(startAt);
    var endDate = new Date(endAt);
    
    var startDateInhms = parseInt(startDate.Format('hhmmss'));
    var endDateInhms = parseInt(endDate.Format('hhmmss'));
    var startDateInd = parseInt(startDate.Format('dd'));
    var endDateInd = parseInt(endDate.Format('dd'));
    
    // console.log(startDateInhms);
    // console.log(endDateInhms);
    // console.log(startDate.endingOfDay());
    // console.log(startDate.beginningOfDay());

    // Calculate the difference in milliseconds
    var differenceInms = Math.abs(startDate.endingOfDay().getTime() - endDate.beginningOfDay().getTime());
    // Convert back to days and return
    var diffDays = Math.round(differenceInms/ondDayInms);
    if (startDateInd == endDateInd) {
        diffDays = 0;
    }
    
    var num = 0;
    if (startDateInhms < time && startDateInd != endDateInd) {
        num += 1;
    }
    if (endDateInhms > time && startDateInd != endDateInd) {
        num += 1;
    }
    var result = diffDays + num;
    // console.log(result);
    return result;
}