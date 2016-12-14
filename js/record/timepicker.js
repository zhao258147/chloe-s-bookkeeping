angular.module('timeAndDate', [])

    .constant('timeAndDateConfig', {
        minuteStep: 10,
        showMeridian: true,
        meridians: ['AM', 'PM'],
        widgetColClass: 'col-xs-4',
        incIconClass: 'icon-chevron-up',
        decIconClass: 'icon-chevron-down',
        daysInAWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]
    })

    .directive('timePicker', ['timeAndDateConfig', '$timeout', '$ionicScrollDelegate', '$location', function(timeAndDateConfig, $timeout, $ionicScrollDelegate, $location) {
        return {
            restrict: 'E',
//            transclude: 'true',
//            scope:{
//                dt: '='
//            },
            templateUrl: 'js/record/templates/timepicker.html',
            link: function(scope, element, attrs) {
                var scrollTimer;
                scope.daysInMonth = [
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,'End'],
                    ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'End']
                ];

                $timeout(function(){
                    scope.highLightedHour = angular.element(document.getElementById("hour0"));
                    scope.highLightedHour.addClass("highlight");
                    scope.highLightedMin = angular.element(document.getElementById("min1"));
                    scope.highLightedMin.addClass("highlight");
                    scope.highLightedMonth = angular.element(document.getElementById("month1"));
                    scope.highLightedMonth.addClass("month-highlight");
                    scope.highLightedDate = angular.element(document.getElementById("date1"));
                    scope.highLightedDate.addClass("highlight");
                });

                function setDt(){
                    if(scope.month != undefined){
                        scope.dt.setUTCMonth(scope.month-1);
                    }
                    if(scope.date != undefined){
                        scope.dt.setDate(scope.date);
                    }
                    if(scope.hour != undefined){
                        console.log(scope.hour);
                        scope.dt.setHours(scope.hour);
                    }
                    if(scope.min != undefined){
                        scope.dt.setMinutes((scope.min - 1) * 10);
                    }

                }

                function anchorHour(hour){
                    console.log(hour);
                    hourHandle.scrollTo(0, hour*30);
//                    $location.hash("hour"+(hour-1));
//                    hourHandle.anchorScroll();
                }

                function anchorMin(min){
                    console.log(min);
                    minHandle.scrollTo(0, min*30);

//                    $location.hash("min"+(min-1));
//                    minHandle.anchorScroll();
                }

                function anchorMonth(month){
                    console.log(month);
                    monthHandle.scrollTo(0, month*30);
//                    $location.hash("month"+(month));
//                    monthHandle.anchorScroll();
                }

                function anchorDate(date){
                    console.log(date);
                    dateHandle.scrollTo(0, date*30);
//                    $location.hash("month"+(month));
//                    monthHandle.anchorScroll();
                }

                var hourHandle = $ionicScrollDelegate.$getByHandle('hourScroll');
                scope.onHourScroll = function () {
                    scope.highLightedHour.removeClass("highlight");
                    scope.hour = Math.floor((hourHandle.getScrollPosition().top + 10)/30);


                    console.log("hour"+scope.hour);

                    if (scrollTimer) {
                        $timeout.cancel(scrollTimer);
                    }
                    scrollTimer = $timeout(function() {
                        $location.hash("hour"+(scope.hour-1));
                        hourHandle.anchorScroll();
                        setDt();
                    }, 200);

                    scope.highLightedHour = angular.element(document.getElementById("hour"+scope.hour));
                    scope.highLightedHour.addClass("highlight");
                };

                var minHandle = $ionicScrollDelegate.$getByHandle('minScroll');
                scope.onMinScroll = function () {
                    console.log(scope.highLightedMin);
                    scope.highLightedMin.removeClass("highlight");
                    scope.min = Math.floor((minHandle.getScrollPosition().top + 40)/30);

                    console.log("min"+scope.min);

                    if (scrollTimer) {
                        $timeout.cancel(scrollTimer);
                    }
                    scrollTimer = $timeout(function() {
                        $location.hash("min"+(scope.min-1));
                        minHandle.anchorScroll();
                        setDt();
                    }, 200);

                    scope.highLightedMin = angular.element(document.getElementById("min"+scope.min));
                    scope.highLightedMin.addClass("highlight");
                };

                var monthHandle = $ionicScrollDelegate.$getByHandle('monthScroll');
                scope.onMonthScroll = function () {
                    scope.highLightedMonth.removeClass("month-highlight");
                    scope.month = Math.floor((monthHandle.getScrollPosition().top + 40)/30);

                    console.log("month"+scope.month);

                    if (scrollTimer) {
                        $timeout.cancel(scrollTimer);
                    }
                    scrollTimer = $timeout(function() {
                        $location.hash("month"+(scope.month-1));
                        monthHandle.anchorScroll();
                        setDt();
                    }, 200);

                    scope.highLightedMonth = angular.element(document.getElementById("month"+scope.month));
                    scope.highLightedMonth.addClass("month-highlight");
                };

                var dateHandle = $ionicScrollDelegate.$getByHandle('dateScroll');
                scope.onDateScroll = function () {

                    console.log(dateHandle.getScrollPosition().top);
                    scope.date = Math.floor((dateHandle.getScrollPosition().top + 40)/30);

                    scope.highLightedDate.removeClass("highlight");
                    console.log("date"+scope.date);

                    if (scrollTimer) {
                        $timeout.cancel(scrollTimer);
                    }
                    scrollTimer = $timeout(function() {
                        $location.hash("date"+(scope.date-1));
                        dateHandle.anchorScroll();
                        setDt();
                    }, 200);

                    scope.highLightedDate = angular.element(document.getElementById("date"+scope.date));
                    scope.highLightedDate.addClass("highlight");
                };


                scope.minuteStep = parseInt(attrs.minuteStep, 10) || timeAndDateConfig.minuteStep;
                scope.showMeridian = scope.$eval(attrs.showMeridian) || timeAndDateConfig.showMeridian;
                scope.meridians = attrs.meridians || timeAndDateConfig.meridians;
                scope.widgetColClass = attrs.widgetColClass || timeAndDateConfig.widgetColClass;
                scope.incIconClass = attrs.incIconClass || timeAndDateConfig.incIconClass;
                scope.decIconClass = attrs.decIconClass || timeAndDateConfig.decIconClass;
                scope.widget = {};
                console.log(attrs);
                scope.showTimePicker = attrs.showTimePicker == 'true' || false;
                scope.showDatePicker = attrs.showDatePicker == 'true' || false;
                scope.allowTimeBeforeNow = attrs.allowTimeBeforeNow || false;

                scope.time = attrs.time;

                console.log(scope);

//                scope.$parent.loadtime = function(t) {
//                    console.log(t);
//                    setDate(t);
//                };

                var dTime;

                scope.decrementHours = function() {
                    dTime.setHours(dTime.getHours()-1);
                    setDate();
//                    if (scope.showMeridian) {
//                        if(dTime.getHours() > 12){
//                            scope.widget.hours = dTime.getHours() - 12;
//                        } else if(dTime.getHours()%12 == 0){
//                            scope.widget.hours = 12;
//                            scope.toggleMeridian();
//                        } else {
//                            scope.widget.hours == dTime.getHours();
//                        }
//                    }
                };

                scope.incrementHours = function() {
                    dTime.setHours(dTime.getHours()+1);
                    setDate();
//                    if (scope.showMeridian) {
//                        if(dTime.getHours() > 12){
//                            scope.widget.hours = dTime.getHours() - 12;
//                        } else if(dTime.getHours()%12 == 0){
//                            scope.widget.hours = 12;
//                            scope.toggleMeridian();
//                        } else {
//                            scope.widget.hours == dTime.getHours();
//                        }
//                    }
//
//                        if (scope.widget.hours === 11) {
//                            scope.widget.hours++;
//                            scope.toggleMeridian();
//                        } else if (scope.widget.hours === 12) {
//                            scope.widget.hours = 1;
//                        } else {
//                            scope.widget.hours++;
//                        }
//                    }
                };

                scope.incrementMinutes = function() {
                    formatMinutes();
                    dTime.setMinutes(scope.widget.minutes+scope.minuteStep);
                    setDate();
                };

                scope.decrementMinutes = function() {
                    formatMinutes();
                    dTime.setMinutes(scope.widget.minutes-scope.minuteStep);
                    setDate();
                };

                scope.toggleMeridian = function() {
//                    scope.widget.meridian = (scope.widget.meridian === scope.meridians[0] ? scope.meridians[1] : scope.meridians[0]);
//                    if(dTime.getHours() > 12){
//                        dTime.setHours(dTime.getHours()-12);
//                    } else {
//                        dTime.setHours(dTime.getHours()+12);
//                    }
                    dTime.setHours(dTime.getHours()+12);
                    setDate();
                };

                scope.toggleMeridianDown = function() {
                    dTime.setHours(dTime.getHours()-12);
                    setDate();
                };


                var setDate = function(overwrite){

                    if(!scope.allowTimeBeforeNow && dTime < Date.now()){
                        dTime = new Date();
                    }
                    if(overwrite){
                        dTime = overwrite;
                    }

                    var theRightHour = scope.widget.hours;
                    var theRightMeridian = scope.widget.meridian;
                    if (scope.showMeridian) {
                        theRightHour = dTime.getHours();
                        if(dTime.getHours() >= 12){
                            if(dTime.getHours() != 12){
                                theRightHour = dTime.getHours() - 12;
                            }
                            theRightMeridian = scope.meridians[1];
                        } else {
                            theRightMeridian = scope.meridians[0];
                        }
                    }
                    $timeout(function(){
                        scope.widget.meridian = theRightMeridian;
                        scope.widget.hours = theRightHour;
                        scope.widget.minutes = dTime.getMinutes();
                        scope.widget.month = timeAndDateConfig.monthNames[dTime.getMonth()];
                        scope.widget.day = dTime.getDate();
                        scope.widget.year = dTime.getFullYear();
                        scope.dayOfWeek = timeAndDateConfig.daysInAWeek[dTime.getDay()];
                        scope.dt = dTime;
                        scope.$parent.dt = dTime;
                        console.log(scope.dt);
                    })
                };

                scope.decrementYear = function() {
                    dTime.setYear(dTime.getFullYear()-1);
                    setDate();
                };

                scope.incrementYear = function() {
                    dTime.setYear(dTime.getFullYear()+1);
                    setDate();
                };

                scope.decrementMonth = function() {
                    dTime.setMonth(dTime.getMonth()-1);
                    setDate();
                };

                scope.incrementMonth = function() {
                    dTime.setMonth(dTime.getMonth()+1);
                    setDate();
                };

                scope.decrementDay = function() {
                    dTime.setDate(dTime.getDate()-1);
                    setDate();
                };

                scope.incrementDay = function() {
                    dTime.setDate(dTime.getDate()+1);
                    setDate();
                };

                function formatMinutes() {
                    if (parseInt(scope.widget.minutes, scope.minuteStep) < scope.minuteStep) {
                        var mi = parseInt(scope.widget.minutes, scope.minuteStep);
                        if(mi > 9){
                            scope.widget.minutes = "" + mi;
                        } else {
                            scope.widget.minutes = '0' + mi;
                        }


                    }

                    console.log(scope.widget.minutes);
                    scope.widget.minutes = Math.floor(scope.widget.minutes / scope.minuteStep) * scope.minuteStep;
                    console.log(scope.widget.minutes);

                };

                var updateModel = function() {
                    if (angular.isDefined(scope.widget) && angular.isDefined(scope.widget.hours) && angular.isDefined(scope.widget.minutes)) {
                        scope.time = scope.widget.hours + ':' + scope.widget.minutes + ' ' + scope.widget.meridian;
                    } else {
                        setTime(scope.time);
                    }
                };

                var isScrollingUp = function(e) {
                    if (e.originalEvent) {
                        e = e.originalEvent;
                    }
                    var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
                    return (e.detail || delta > 0);
                };

                var setTime = function(time) {
                    var timeArray, hours, minutes;
                    console.log(time);
                    if (time) {
                        dTime = scope.dt;
                        if (time.match(new RegExp(scope.meridians[1].substring(0,1), 'i'))) {
                            scope.widget.meridian = scope.meridians[1];
                        } else {
                            scope.widget.meridian = scope.meridians[0];
                        }

                        timeArray = time.replace(/[^0-9\:]/g, '').split(':');
                        hours = timeArray[0] ? timeArray[0].toString() : timeArray.toString();
                        minutes = timeArray[1] ? timeArray[1].toString() : '';

                        if (hours.length > 2) {
                            minutes = hours.substr(2, 2);
                            hours = hours.substr(0, 2);
                        }
                        if (minutes.length > 2) {
                            minutes = minutes.substr(0, 2);
                        }

                        hours = parseInt(hours, 10);
                        minutes = parseInt(minutes, 10);

                        if (isNaN(hours)) {
                            hours = 0;
                        }
                        if (isNaN(minutes)) {
                            minutes = 0;
                        }

                    } else { // set current time

                        dTime = scope.dt;
                        hours = dTime.getHours();
                        minutes = dTime.getMinutes();

                        setDate();
                        if(minutes > 50){
                            minutes = 50;
                        }
                        anchorMin(Math.ceil(minutes/10));
                        anchorHour(hours);
                        anchorMonth(dTime.getUTCMonth());
                        $timeout(function(){
                            anchorDate(dTime.getDate() - 1);
                        },200);


//                        anchorHour(hours);
//                        anchorMonth(dTime.getUTCMonth());


                        if (scope.showMeridian && hours >= 12) {
                            scope.widget.meridian = scope.meridians[1];
                        } else {
                            scope.widget.meridian = scope.meridians[0];
                        }
                    }

                    if (scope.showMeridian) {
                        if (hours === 0) {
                            scope.widget.hours = 12;
                        } else if (hours > 12) {
                            scope.widget.hours = hours - 12;
                            scope.widget.meridian = scope.meridians[1];
                        } else {
                            scope.widget.hours = hours;
                        }

                    } else {
                        scope.widget.hours = hours;
                    }

                    scope.widget.minutes = Math.ceil(minutes / scope.minuteStep) * scope.minuteStep;

                    formatMinutes();

                    scope.time = scope.widget.hours + ':' + scope.widget.minutes + ' ' + scope.widget.meridian;


                };

                scope.$watch('widget', function(val) {
                    console.log(val);
                    updateModel();
                }, true);
            }
        };
    }]);