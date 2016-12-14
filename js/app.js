// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'accountModule', 'recordModule', 'calendarModule', 'reportModule'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'js/account/templates/login.html',
                controller: 'LoginCtrl'
            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'MainCtrl'
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'RecordDashboardCtrl'
                    }
                }
            })

            .state('tab.waiting-for-payment', {
                url: '/waiting-for-payment',
                views: {
                    'tab-dash': {
                        templateUrl: 'js/record/templates/waiting-for-payment.html',
                        controller: 'WaitingForPaymentCtrl'
                    }
                }
            })

            .state('tab.most-urgent', {
                url: '/most-urgent',
                views: {
                    'tab-dash': {
                        templateUrl: 'js/record/templates/most-urgent.html',
                        controller: 'MostUrgentCtrl'
                    }
                }
            })

            .state('tab.customers', {
                url: '/customers',
                views: {
                    'tab-chats': {
                        templateUrl: 'js/record/templates/customer-search.html',
                        controller: 'CustomerSearchCtrl'
                    }
                }
            })

            .state('tab.customer', {
                url: '/customer/:customerID',
                views: {
                    'tab-chats': {
                        templateUrl: 'js/record/templates/customer-detail.html',
                        controller: 'CustomerDetailCtrl'
                    }
                }
            })

            .state('tab.records', {
                url: '/records/:customerID/:year/:month/:date',
                views: {
                    'tab-chats': {
                        templateUrl: 'js/record/templates/record-search.html',
                        controller: 'RecordSearchCtrl'
                    }
                }
            })



            .state('tab.record', {
                url: '/record/:recordID',
                views: {
                    'tab-chats': {
                        templateUrl: 'js/record/templates/record-detail.html',
                        controller: 'RecordDetailCtrl'
                    }
                }
            })

            .state('add-record', {
                url: '/add-record',
                templateUrl: 'js/record/templates/add-record.html',
                controller: 'AddRecordCtrl'
            })

            .state('tab.calendar', {
                url: '/calendar',
                views: {
                    'tab-chats': {
                        templateUrl: 'js/calendar/templates/calendar.html',
                        controller: 'CalendarController'
                    }
                }
            })

            .state('tab.report', {
                url: '/report/:customerID/:startDate/:endDate/:includeTypes',
                views: {
                    'tab-chats': {
                        templateUrl: 'js/report/templates/report.html',
                        controller: 'CustomerReportCtrl'
                    }
                }
            })

            .state('invoice', {
                url: '/invoice/:recordID/:preferredTemplate',
                templateUrl: function(stateParams){
                    console.log(stateParams);
                    if(stateParams.preferredTemplate){
                        return 'js/report/templates/' + stateParams.preferredTemplate + '.html'
                    }
                    return 'js/report/templates/invoice.html'
                },
                controller: 'InvoiceCtrl'
            })

            .state('tab.calendar-day', {
                url: '/calendar-day',
                views: {
                    'tab-chats': {
                        templateUrl: 'js/calendar/templates/calendar-day.html',
                        controller: 'CalendarController'
                    }
                }
            })

            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    })
    .run(function($ionicPlatform, $rootScope, appFactory, UserAuth, $state){
        console.log(appFactory);
        if(!appFactory.user){
            window.location.href = "#/login";
        }

    })
    .controller("MainCtrl", function($scope, $state, $timeout, $window, Users, $ionicPopup, $ionicModal, Customers, Records, appFactory, $ionicPopover){
        console.log("MainCtrl");

        $scope.addRecord = function(){
            $state.go("add-record");
        };

        $scope.clickOnCustomer = function(){
            $state.go("tab.customers");
        }

    });
