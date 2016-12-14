var record = angular.module('recordModule', ['ionic', 'starter', "firebase", 'timeAndDate', 'nvd3ChartDirectives'])

    .controller('CustomerSearchCtrl', function($scope, Customers, $state) {
        $scope.searchKey = "";
        Customers.getList().then(function(customers){
            console.log(customers);
            $scope.customers = customers;
        });

        $scope.onClickCustomer = function(item){
            $state.go('tab.customer', {customerID: item.$id});
        };

        $scope.manage = function(item){
            $state.go('tab.customer', {customerID: item.$id});
        };
    })

    .controller('CustomerDetailCtrl', function($scope, Customers, Records, $state, $stateParams, $ionicPopup, Credits) {
        $scope.start = {};
        $scope.end = {};

        $scope.start.year = 2016;
        $scope.end.year = 2016;

        Customers.get($stateParams.customerID).then(function(data){
            console.log(data);
            $scope.customer = data;
        });

        $scope.customerTransactions = function(){
            $state.go('tab.records', {customerID: $scope.customer.$id});
        };

        Records.getCustomerRecords($stateParams.customerID).then(function(data){
            console.log(data);
            $scope.records = data;
        });

        $scope.buildReport = function(){
            $scope.includeTypes = {};
            $scope.includeTypes.getPayments = true;
            $scope.includeTypes.getCosts = true;
            $scope.includeTypes.getInvoices = true;
            $scope.includeTypes.getCreadits = true;

            var myPopup = $ionicPopup.show({
                templateUrl: 'js/record/templates/build-report-popup.html',
                title: 'Choose Report Time',
                subTitle: 'Please fill in start time and end time',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {

                            if($scope.start.year && $scope.start.month && $scope.start.date
                                && $scope.end.year && $scope.end.month && $scope.end.date){
                                console.log($scope.start);
                                console.log($scope.end);

                                $scope.startDate = new Date();
                                $scope.endDate = new Date();
                                $scope.startDate.setYear($scope.start.year);
                                $scope.startDate.setMonth($scope.start.month-1);
                                $scope.startDate.setDate($scope.start.date);
                                $scope.startDate.setHours(0);
                                $scope.startDate.setMinutes(0);
                                $scope.startDate.setSeconds(0);

                                $scope.endDate.setYear($scope.end.year);
                                $scope.endDate.setMonth($scope.end.month-1);
                                $scope.endDate.setDate($scope.end.date);
                                $scope.endDate.setHours(0);
                                $scope.endDate.setMinutes(0);
                                $scope.endDate.setSeconds(0);

                                var includeTypes = "";
                                includeTypes += ($scope.includeTypes.getPayments) ? "payments," : "";
                                includeTypes += ($scope.includeTypes.getCosts) ? "costs," : "";
                                includeTypes += ($scope.includeTypes.getInvoices) ? "invoices," : "";
                                includeTypes += ($scope.includeTypes.getCreadits) ? "credits," : "";

                                if($scope.endDate < $scope.startDate){
                                    $scope.message = "End date must be after start date";
                                    e.preventDefault();
                                } else {
                                    $state.go("tab.report", {customerID: $stateParams.customerID, startDate: $scope.startDate.getTime(), endDate: $scope.endDate.getTime(), includeTypes: includeTypes});
                                }
                            } else {
                                $scope.message = "Start date and end date cannot be empty";
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        $scope.newcredit = {};
        $scope.showAddCredit = false;
        $scope.addCredit = function(){
            if($scope.newcredit.amount){
                if(!$scope.customer.credit) $scope.customer.credit = 0;
                $scope.customer.credit += $scope.newcredit.amount;

                var credit = {
                    type: "credit",
                    amount: $scope.newcredit.amount,
                    customerID: $scope.customer.$id,
                    customerName: $scope.customer.name,
                    notes: $scope.newcredit.notes ? $scope.newcredit.notes : "",
                    timestamp: Firebase.ServerValue.TIMESTAMP
                };

                Credits.add(credit);

                Customers.saveCustomerObj($scope.customer);

                $scope.newcredit = {};
                $scope.showAddInvoice = false;
            }
        };

        $scope.select = {};
        $scope.select.option = 'timestamp';
        $scope.predicate = 'timestamp';
        $scope.reverse = true;

        $scope.order = function (predicate) {
            console.log(predicate);
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };
    })

    .controller('RecordSearchCtrl', function($scope, Customers, Records, $stateParams) {
        console.log($stateParams);

        $scope.records = [];
        if($stateParams.customerID){
            Records.getCustomerRecords($stateParams.customerID).then(function(data){
                console.log(data);
                $scope.records = data;
            });
        } else if($stateParams.month && $stateParams.date ){
            var firstDay = new Date();
            firstDay.setDate(1);
            firstDay.setFullYear($stateParams.year);
            firstDay.setMonth($stateParams.month);
            firstDay.setDate($stateParams.date);
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);
            console.log(firstDay);

            var lastDay = new Date();
            lastDay.setDate(1);
            lastDay.setFullYear($stateParams.year);
            lastDay.setMonth($stateParams.month);
            lastDay.setDate(parseInt($stateParams.date) + 1);
            lastDay.setHours(0);
            lastDay.setMinutes(0);
            lastDay.setSeconds(0);
            console.log(lastDay);

            Records.getDueRecordsByTime(firstDay, lastDay).then(function(data){
                console.log(data);
                $scope.records = data;
            });
        }


    })

    .controller('RecordDetailCtrl', function($scope, Customers, $ionicModal, Records, $state, $stateParams, appFactory, Users, $ionicPopup, $timeout) {
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            console.log(viewData);
            viewData.enableBack = true;
        });

        $scope.user = appFactory.user;

        $scope.back = function(){
            $state.go('tab.customers');
        };

        Records.get($stateParams.recordID).then(function(data){
            $scope.record = data;
            $scope.duedate = new Date($scope.record.due);
            Customers.get($scope.record.customerID).then(function(customer){
                $scope.customer = customer;
            });
            $scope.dt = new Date($scope.record.time);

            $scope.calcInvoice();
            $scope.calcPaid();
            $scope.calcCost();
        });

        $scope.calcInvoice = function(){
            $scope.record.invoice = 0;
            $scope.record.paid = 0;
            for(var i=0; i<$scope.record.transactions.length; i++){
                if($scope.record.transactions[i].type == "invoice"){
                    $scope.record.invoice += $scope.record.transactions[i].amount;
                }
                if($scope.record.transactions[i].type == "payment"){
                    $scope.record.paid += $scope.record.transactions[i].amount;
                }
            }
            console.log($scope.record.invoice);
            console.log($scope.record.paid);
        };

        $scope.calcPaid = function(){
            $scope.incomeData = [
                {
                    "key": "Paid",
                    "values": [
                        [ "income" , $scope.record.paid]
                    ]
                },
                {
                    "key": "Not Paid",
                    "values": [
                        [ "income" , $scope.record.invoice - $scope.record.paid]
                    ]
                }
            ];
        };

        $scope.calcCost = function(){
            $scope.profit = $scope.record.invoice - ($scope.record.cost|0);
            if($scope.profit < 0) $scope.profit = 0;
            $scope.costData = [
                {
                    "key": "Cost",
                    "values": [
                        [ "Cost" , $scope.record.cost | 0]
                    ]
                },
                {
                    "key": "Profit",
                    "values": [
                        [ "Cost" , $scope.profit]
                    ]
                }
            ];
        };

        $scope.showPaymentMethodSuggestion = false;
        $scope.showPayableToSuggestion = false;

        $scope.paymentMethods = appFactory.user.paymentMethods;
        if(!appFactory.user.payableTos) appFactory.user.payableTos = [];
        $scope.payableTos = appFactory.user.payableTos;

        $scope.showAddPayment = false;
        $scope.showAddInvoice = false;
        $scope.showTransactions = false;
        $scope.showAddCost = false;

        $scope.newpayment = {};
        $scope.newinvoice = {};
        $scope.newcost = {};

        $scope.onClick = function($event){
            if($event.target.className.indexOf("payment-button") < 0) {
                $scope.showPaymentMethodSuggestion = false;
            }
        };

        $scope.progressChange = function(progress){
            if(progress == 100){
                $scope.record.completeDate = Firebase.ServerValue.TIMESTAMP;
                $scope.record.indexedDue = Number.MAX_SAFE_INTEGER;
                Records.save($scope.record);
            } else {
                delete $scope.record.completeDate;
                $scope.record.indexedDue = new Date().getTime();
            }
        };

        $scope.$watch('newpayment.method', function(newValue) {
            console.log();
            var found = false;
            for(var i=0; i<$scope.paymentMethods.length; i++){
                if($scope.paymentMethods[i].indexOf(newValue) >= 0){
                    if($scope.paymentMethods[i] != newValue){
                        found = true;
                    }
                }
            }
            $scope.showPaymentMethodSuggestion = found;

        });

        $scope.$watch('newcost.payableTo', function(newValue) {
            console.log(newValue);
            var found = false;
            for(var i=0; i<$scope.payableTos.length; i++){
                if($scope.payableTos[i].indexOf(newValue) >= 0){
                    if($scope.payableTos[i] != newValue){
                        found = true;
                    }
                }
            }
            $scope.showPayableToSuggestion = found;

        });

        $scope.addCost = function(){
            if($scope.newcost.amount){
                if(!$scope.record.cost) $scope.record.cost = 0;
                $scope.record.cost += $scope.newcost.amount;
                if(!$scope.newcost.payableTo){
                    $scope.newcost.payableTo = "unknown";
                } else {
                    if($scope.payableTos.indexOf($scope.newcost.payableTo) < 0){
                        $scope.payableTos.push($scope.newcost.payableTo);
                        Users.save(appFactory.user);
                    }
                }
                if(!$scope.record.transactions) $scope.record.transactions = [];
                var newtran = {
                    type: "cost",
                    amount: $scope.newcost.amount,
                    payableTo: $scope.newcost.payableTo ?  $scope.newcost.payableTo: "",
                    notes: $scope.newcost.notes ? $scope.newcost.notes: "",
                    timestamp: Firebase.ServerValue.TIMESTAMP
                };
                console.log(newtran);
                $scope.record.transactions.push(newtran);

                $scope.calcPaid();
                $scope.calcCost();

                console.log($scope.record);
                Records.save($scope.record);
                console.log($scope.record.transactions);

                $scope.newcost = {};
                $scope.showAddCost = false;
            }
        };

        $scope.addInvoice = function(){
            if(!$scope.newinvoice.amount) {
                $scope.newinvoice.amount = $scope.newinvoice.numUnits * $scope.newinvoice.unitPrice;
            }
            if($scope.newinvoice.amount > 0){
                if(!$scope.record.invoice) $scope.record.invoice = 0;
                $scope.record.invoice += $scope.newinvoice.amount;

                if(!$scope.record.transactions) $scope.record.transactions = [];
                $scope.record.transactions.push({
                    type: "invoice",
                    name: $scope.newinvoice.name ? $scope.newinvoice.name : "",
                    amount: $scope.newinvoice.amount,
                    unit: $scope.newinvoice.unit ? $scope.newinvoice.unit : "",
                    numUnits: $scope.newinvoice.numUnits ? $scope.newinvoice.numUnits : 1,
                    unitPrice: $scope.newinvoice.unitPrice ? $scope.newinvoice.unitPrice : $scope.newinvoice.amount,
                    notes: $scope.newinvoice.notes ? $scope.newinvoice.notes : "",
                    timestamp: Firebase.ServerValue.TIMESTAMP
                });

                if($scope.record.invoice > $scope.record.paid){
                    $scope.record.datePaymentCleared = 0;
                }
                Records.save($scope.record);

                $scope.newinvoice = {};
                $scope.showAddInvoice = false;

                $scope.calcPaid();
                $scope.calcCost();
            }
        };

        $scope.payWithCreditFlip = function(payWithCredit){
            if(payWithCredit){
                $scope.newpayment.oldMethod = $scope.newpayment.method;
                $scope.newpayment.method = "credit";
                $scope.newpayment.oldAmount = $scope.newpayment.amount;
                if($scope.newpayment.amount > $scope.customer.credit){
                    $scope.newpayment.amount = $scope.customer.credit;
                }
            } else {
                $scope.newpayment.method = $scope.newpayment.oldMethod;
                $scope.newpayment.amount = $scope.customer.oldAmount;
            }
        };

        $scope.addPayment = function(){
            if($scope.newpayment.amount){
                if($scope.newpayment.payWithCredit){
                    if($scope.newpayment.amount > $scope.customer.credit){
                        $scope.newpayment.amount = $scope.customer.credit;
                    }
                }

                $scope.record.paid += $scope.newpayment.amount;
                if(!$scope.newpayment.method){
                    $scope.newpayment.method = "unknown";
                } else {
                    if($scope.paymentMethods.indexOf($scope.newpayment.method) < 0){
                        $scope.paymentMethods.push($scope.newpayment.method);
                        Users.save(appFactory.user);
                    }
                }
                if(!$scope.record.transactions) $scope.record.transactions = [];
                $scope.record.transactions.push({
                    type: "payment",
                    amount: $scope.newpayment.amount,
                    payWithCredit: $scope.newpayment.payWithCredit ? true : false,
                    method: $scope.newpayment.method ? $scope.newpayment.method : "",
                    notes: $scope.newpayment.notes ? $scope.newpayment.notes : "",
                    timestamp: Firebase.ServerValue.TIMESTAMP
                });
                if($scope.record.paid >= $scope.record.invoice){
                    $scope.record.datePaymentCleared = Firebase.ServerValue.TIMESTAMP;
                }

                $scope.calcPaid();
                $scope.calcCost();

                console.log($scope.record);

                Records.save($scope.record);

                if($scope.newpayment.payWithCredit){
                    $scope.customer.credit -= $scope.newpayment.amount;
                    Customers.saveCustomerObj($scope.customer);
                }

                console.log($scope.record.transactions);

                $scope.newpayment = {};
                $scope.showAddPayment = false;
            }
        };

        $scope.closeWithoutClearingPayment = function(){
            $scope.record.datePaymentCleared = Firebase.ServerValue.TIMESTAMP;
            Records.save($scope.record);
        };

        $scope.paidInFull = function(){
            $scope.record.transactions.push({
                type: "payment",
                payWithCredit: false,
                amount: $scope.record.invoice - $scope.record.paid,
                method: "Full Payment",
                notes: "Paid in full",
                timestamp: Firebase.ServerValue.TIMESTAMP
            });
            $scope.record.paid = $scope.record.invoice;
            $scope.record.datePaymentCleared = Firebase.ServerValue.TIMESTAMP;
            $scope.calcPaid();
            $scope.calcCost();
            Records.save($scope.record);
        };

        $scope.buildInvoice = function(){
            $state.go("invoice", {recordID: $stateParams.recordID, preferredTemplate: "invoice2"});
        };

        $scope.save = function(){
            $scope.record.lastModifiedDate = Firebase.ServerValue.TIMESTAMP;
//            if($scope.record.paid == $scope.record.invoice){
//                $scope.record.datePaymentCleared = Firebase.ServerValue.TIMESTAMP;
//            }
//            if($scope.record.completeDate){
//                $scope.record.completeDate = Firebase.ServerValue.TIMESTAMP;
//            }
            Records.save($scope.record).then(function(){

            }, function(err){
                console.log(err);
                $ionicPopup.alert({
                    title: 'Error',
                    content: "Cannot save record"
                });
            });
        }

        $scope.complete = function(){
            $scope.record.indexedDue = Number.MAX_SAFE_INTEGER;
            $scope.record.completeDate = Firebase.ServerValue.TIMESTAMP;
            console.log($scope.record);
            Records.save($scope.record);
        };

        $scope.focusOnTransaction = function(transaction){
            transaction.showSaveButton = true;
            transaction.oldTransaction = transaction;
        };

        $scope.saveTransaction = function(transaction){
            console.log(transaction);
            if(transaction.type == "payment"){
                $scope.record.paid = 0;
                for(var i=0; i<$scope.record.transactions.length; i++){
                    if($scope.record.transactions[i].type == "payment") {
                        $scope.record.paid += $scope.record.transactions[i].amount;
                    }
                }

            } else if(transaction.type == "cost"){
                $scope.record.cost = 0;
                for(var i=0; i<$scope.record.transactions.length; i++){
                    if($scope.record.transactions[i].type == "cost"){
                        $scope.record.cost += $scope.record.transactions[i].amount;
                    }
                }
            } else if(transaction.type == "invoice"){
                $scope.calcInvoice();
            }
            $scope.calcPaid();
            $scope.calcCost();

            if($scope.record.invoice > $scope.record.paid){
                $scope.record.datePaymentCleared = 0;
            }

            delete transaction.showSaveButton;
            delete transaction.oldTransaction;
            Records.save($scope.record);
        };

        $scope.cancelTransaction = function(transaction){
            transaction = transaction.oldTransaction;
            delete transaction.showSaveButton;
            delete transaction.oldTransaction;
        };

        $scope.removeTransaction = function(transaction){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Transaction',
                template: 'Are you sure you want to delete this transaction?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    for(var i=0; i<$scope.record.transactions.length; i++){
                        if($scope.record.transactions[i].timestamp == transaction.timestamp){
                            $scope.record.transactions.splice(i, 1);
                            $scope.calcPaid();
                            $scope.calcCost();
                            $scope.saveTransaction(transaction);
                        }
                    }
                }
            });
        };

        $scope.predicate = 'timestamp';
        $scope.reverse = true;

        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };
    })

    .controller('WaitingForPaymentCtrl', function($scope, Customers, Records, $ionicPopup, $state) {
        Records.getAllUncollectedRecords().then(function(data){
            console.log(data);
            $scope.uncollectedRecords = data;
        });
    })

    .controller('MostUrgentCtrl', function($scope, Customers, Records, $ionicPopup, $state) {
        Records.getAllUrgentRecords().then(function(data){
            console.log(data);
            $scope.recentRecords = data;
        });
    })

    .controller('RecordDashboardCtrl', function($scope, Customers, Records, $ionicPopup, $state) {
        $scope.records = [];
        $scope.today = new Date();
        Records.getUncollectedRecords().then(function(data){
            console.log(data);
            $scope.uncollectedRecords = data;
        });

        Records.getUrgentRecords().then(function(data){
            console.log(data);
            $scope.recentRecords = data;
        });

        $scope.includeTypes = {};
        $scope.includeTypes.getPayments = true;
        $scope.includeTypes.getCosts = true;
        $scope.includeTypes.getInvoices = true;
        $scope.includeTypes.getCreadits = true;

        $scope.buildReport = function(){
            $scope.start = {};
            $scope.end = {};

            $scope.start.year = 2016;
            $scope.end.year = 2016;

            var myPopup = $ionicPopup.show({
                templateUrl: 'js/record/templates/build-report-popup.html',
                title: 'Choose Report Time',
                subTitle: 'Please fill in start time and end time',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            console.log($scope.includeTypes);

                            if($scope.start.year && $scope.start.month && $scope.start.date
                                && $scope.end.year && $scope.end.month && $scope.end.date){
                                console.log($scope.start);
                                console.log($scope.end);

                                $scope.startDate = new Date();
                                $scope.endDate = new Date();
                                $scope.startDate.setYear($scope.start.year);
                                $scope.startDate.setMonth($scope.start.month-1);
                                $scope.startDate.setDate($scope.start.date);
                                $scope.startDate.setHours(0);
                                $scope.startDate.setMinutes(0);
                                $scope.startDate.setSeconds(0);

                                $scope.endDate.setYear($scope.end.year);
                                $scope.endDate.setMonth($scope.end.month-1);
                                $scope.endDate.setDate($scope.end.date);
                                $scope.endDate.setHours(0);
                                $scope.endDate.setMinutes(0);
                                $scope.endDate.setSeconds(0);

                                var includeTypes = "";
                                includeTypes += ($scope.includeTypes.getPayments) ? "payment," : "";
                                includeTypes += ($scope.includeTypes.getCosts) ? "cost," : "";
                                includeTypes += ($scope.includeTypes.getInvoices) ? "invoice," : "";
                                includeTypes += ($scope.includeTypes.getCreadits) ? "credit," : "";
                                console.log(includeTypes);
                                if($scope.endDate < $scope.startDate){
                                    $scope.message = "End date must be after start date";
                                    e.preventDefault();
                                } else {
                                    $state.go("tab.report", {startDate: $scope.startDate.getTime(), endDate: $scope.endDate.getTime(), includeTypes: includeTypes});
                                }
                            } else {
                                $scope.message = "Start date and end date cannot be empty";
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        $scope.complete = function(item, array){
            console.log(Number.MAX_SAFE_INTEGER);
            item.indexedDue = Number.MAX_SAFE_INTEGER;
            item.progress = 100;
            item.completeDate = Firebase.ServerValue.TIMESTAMP;
            console.log(item);
            Records.saveInArray(array, item);
        };

        $scope.removeFromProgressList = function(item, array){
            item.indexedDue = Number.MAX_SAFE_INTEGER;
            item.completeDate = Firebase.ServerValue.TIMESTAMP;

            Records.saveInArray(array, item);
        };

        $scope.closeWithoutClearingPayment = function(item, array){
            item.datePaymentCleared = Firebase.ServerValue.TIMESTAMP;

            Records.saveInArray(array, item);
        };

        $scope.paidInFull = function(item, array){
            item.transactions.push({
                amount: item.amount - item.paid,
                method: "unknown",
                timestamp: Firebase.ServerValue.TIMESTAMP
            });
            item.paid = item.amount;
            item.datePaymentCleared = Firebase.ServerValue.TIMESTAMP;

            Records.saveInArray(array, item);
        };

        $scope.goto = function(item){
            $state.go("tab.record", {recordID: item.$id});
        };
        $scope.xFunction = function() {
            return function(d) {
                return d.key;
            };
        };
        $scope.yFunction = function() {
            return function(d) {
                return d.y;
            };
        };



    })
    .controller("AddRecordCtrl", function($scope, $state, $timeout, $window, Users, $ionicPopup, $ionicModal, Customers, Records, appFactory){
        console.log("MainCtrl");
        console.log($scope);

        $scope.newrecord = {};
        $scope.deposit = {};

        Customers.getList().then(function(data){
            $scope.customers = data;
            console.log(data);
        });

        $scope.dt = new Date();

        $scope.showCustomerSuggestion = false;
        $scope.showPaymentMethodSuggestion = false;
        $scope.paymentMethods = appFactory.user.paymentMethods;

        var saveRecord = function(){
            Records.add($scope.newrecord).then(function(ref){
                $ionicPopup.alert({
                    title: 'Success',
                    content: "New record saved"
                });
                $scope.newrecord = {};
                $scope.deposit = {};
                console.log(ref);
                $state.go("tab.record", {recordID: ref.key()});
            }, function(error){
                $ionicPopup.alert({
                    title: 'Error',
                    content: error
                });
            });
        };

        $scope.addRecord = function(){
            console.log($scope.dt);

            console.log($scope.newrecord);
            $scope.newrecord.created = Firebase.ServerValue.TIMESTAMP;
            $scope.newrecord.lastModifiedDate = Firebase.ServerValue.TIMESTAMP;
            $scope.newrecord.transactions = [];
            $scope.newrecord.progress = 0;
            $scope.newrecord.invoice = 0;
            $scope.newrecord.paid = 0;
            if($scope.deposit.amount){
                $scope.newrecord.paid = $scope.deposit.amount;
                if(!$scope.deposit.method){
                    $scope.deposit.method = "unknown";
                } else {
                    if($scope.paymentMethods.indexOf($scope.deposit.method) < 0){
                        $scope.paymentMethods.push($scope.deposit.method);
                        console.log(appFactory.user.paymentMethods);
                        Users.save(appFactory.user);
                    }
                }
                $scope.newrecord.transactions.push({
                    amount: $scope.deposit.amount,
                    method: $scope.deposit.method,
                    timestamp: Firebase.ServerValue.TIMESTAMP,
                    deposit: true
                });
            }

            $scope.newrecord.due = $scope.dt.getTime();
            $scope.newrecord.indexedDue = $scope.dt.getTime();

            $scope.newrecord.datePaymentCleared = 0;
            console.log($scope.newrecord);

            if(!$scope.newrecord.customerID){
                Customers.save($scope.newrecord.customer).then(function(ref){
                    $scope.newrecord.customerID = ref.key();
                    saveRecord();
                });
            } else {
                saveRecord();
            }

        };

        $scope.close = function(){
            $state.go("tab.dash");
        };

        $scope.onClick = function($event){
            console.log($scope.dt);
            if($event.target.className.indexOf("customer-button") < 0){
                $scope.showCustomerSuggestion = false;
            }
            if($event.target.className.indexOf("payment-button") < 0) {
                $scope.showPaymentMethodSuggestion = false;
            }
        };

        $scope.selectCustomer = function(item){
            $scope.newrecord.customer = item.name;
            $scope.newrecord.customerID = item.$id;
        };

        $scope.selectPaymentMethod = function(paymentMethod){
            $scope.deposit.method = paymentMethod;
            if($scope.paymentMethods.indexOf(paymentMethod) < 0){
                $scope.paymentMethods.push(paymentMethod);
            }

        };

        $scope.$watch('deposit.method', function(newValue) {
            var found = false;
            for(var i=0; i<$scope.paymentMethods.length; i++){
                if($scope.paymentMethods[i].indexOf(newValue) >= 0){
                    if($scope.paymentMethods[i] != newValue){
                        found = true;
                    }
                }
            }
            $scope.showPaymentMethodSuggestion = found;

        });

        $scope.$watch('newrecord.customer', function(newValue) {
            var found = false;
            for(var i=0; i<$scope.customers.length; i++){
                if($scope.customers[i].name.indexOf($scope.newrecord.customer) >= 0){
                    if($scope.customers[i].name != $scope.newrecord.customer){
                        found = true;
                    } else {
                        $scope.newrecord.customerID = $scope.customers[i].$id;
                    }
                }
            }
            $scope.showCustomerSuggestion = found;

        });

    });