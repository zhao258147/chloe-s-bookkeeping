var calendar = angular.module('calendarModule', ['ionic', 'starter', 'react'])
.directive('calendar', function(reactDirective) {
    return reactDirective(Calendar);
})
.controller( 'CalendarController', function( $scope, $interval, $ionicLoading, $stateParams, $state, Records, Users, $firebaseObject, $firebaseArray, $ionicPopup) {
    $ionicLoading.show({
        content: '<i class="icon ion-looping"></i> Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.selected = moment().startOf("day");

    $scope.numbers = [[],[],[],[],[],[],[],[],[],[],[],[]];

    var populateNumbers = function(month, year){
        console.log(month);
        $scope.numbers[month] = [];

        var firstDay = new Date();
        firstDay.setDate(1);
        firstDay.setFullYear(year);
        firstDay.setMonth(month);
        firstDay.setHours(0);
        firstDay.setMinutes(0);
        firstDay.setSeconds(0);
        console.log(firstDay);

        var lastDay = new Date();
        lastDay.setDate(1);
        lastDay.setFullYear(year);
        lastDay.setMonth(month + 1);
        lastDay.setHours(0);
        lastDay.setMinutes(0);
        lastDay.setSeconds(0);
        console.log(lastDay);

        Records.getDueRecordsByTime(firstDay, lastDay).then(function(data){
            console.log(data);
            for(var i=0; i<data.length; i++){
                var due = new Date(data[i].due);
                if(!$scope.numbers[month][due.getDate()]) $scope.numbers[month][due.getDate()] = 0;
                $scope.numbers[month][due.getDate()]++;
            }
            console.log($scope.numbers);
            render();
        }, function(error){
            console.log(error);
            $ionicPopup.alert({
                title: 'Error',
                content: "Cannot get record"
            });
        });
    };

    populateNumbers(new Date().getMonth(), new Date().getFullYear());

    $scope.goto = function(day){
        console.log(day);
        console.log(day.date.year());
        console.log(day.date.month());
        console.log(day.date.date());

        $state.go('tab.records', {year: day.date.year(), month: day.date.month(), date: day.date.date()});
    };

    $scope.next = function(month, year){
        console.log(year);
        populateNumbers(month, year);
    };

    $scope.previous = function(month, year){
        populateNumbers(month, year);
    };

    render();

    function render(){
        $ionicLoading.hide();
        React.render(
            React.createElement(Calendar, {selected: $scope.selected, numbers: $scope.numbers, goto: $scope.goto, next: $scope.next, previous: $scope.previous}),
            document.getElementById('calendar')
        );
    }
});