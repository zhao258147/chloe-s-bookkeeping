var report = angular.module('reportModule', ['ionic', 'starter', "firebase", 'timeAndDate'])

    .controller('CustomerReportCtrl', function($scope, Customers, Records, $state, $stateParams, Credits) {
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            console.log(viewData);
            viewData.enableBack = true;
        });

        $scope.transactions = [];
        console.log($stateParams);
        $scope.customerID = $stateParams.customerID;
        $scope.paymentSum = 0;
        $scope.costSum = 0;
        $scope.invoiceSum = 0;
        $scope.creditSum = 0;

        if($stateParams.includeTypes && $stateParams.includeTypes.indexOf("credit") >= 0){
            Credits.getCreditsByTime(new Date(parseInt($stateParams.startDate)), new Date(parseInt($stateParams.endDate))).then(function(data){
                $scope.records = data;
                console.log(data);

                for (var k = 0; k < data.length; k++) {
                    console.log($stateParams);
                    console.log(data[k]);
                    if($stateParams.customerID && $stateParams.customerID != data[k].customerID){
                        continue;
                    }
                    var transaction = {
                        amount: data[k].amount,
                        customerName: data[k].customerName,
                        type: "credit",
                        timestamp: data[k].timestamp,
                        totalAmount: data[k].amount,
                        recordCreated: data[k].timestamp
                    };
                    $scope.creditSum += data[k].amount;
                    $scope.transactions.push(transaction);
                    console.log($scope.transactions);
                }
            });
        }


        Records.getCreatedRecordsByTime(new Date(parseInt($stateParams.startDate)), new Date(parseInt($stateParams.endDate))).then(function (data) {
            $scope.records = data;
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                if($stateParams.customerID ? $stateParams.customerID != data[i].customerID : false){
                    continue;
                }
                if(!data[i].hasOwnProperty('transactions')){
                    continue;
                }
                for (var k = 0; k < data[i].transactions.length; k++) {
                    console.log(data[i].transactions[k]);
                    if($stateParams.includeTypes && $stateParams.includeTypes.indexOf(data[i].transactions[k].type) < 0){
                        continue;
                    }
                    var transaction = {
                        amount: data[i].transactions[k].amount,
                        deposit: false,
                        customerName: data[i].customer,
                        type: data[i].transactions[k].type,
                        method: data[i].transactions[k].method,
                        timestamp: data[i].transactions[k].timestamp,
                        due: data[i].due,
                        datePaymentCleared: data[i].datePaymentCleared,
                        completeDate: data[i].completeDate,
                        totalAmount: data[i].amount,
                        recordCreated: data[i].created
                    };
                    if (data[i].transactions[k].deposit) {
                        transaction.deposite = true;
                    }
                    if(data[i].transactions[k].type == "payment"){
                        transaction.method = "Payment Method: " + data[i].transactions[k].method;
                        $scope.paymentSum += data[i].transactions[k].amount;
                    } else if(data[i].transactions[k].type == "cost"){
                        transaction.method = "Paid To: " + data[i].transactions[k].payableTo;
                        $scope.costSum += data[i].transactions[k].amount;
                    } else if(data[i].transactions[k].type == "invoice"){
                        transaction.method = "Service Name: " + data[i].transactions[k].name;
                        $scope.invoiceSum += data[i].transactions[k].amount;
                    }

                    $scope.transactions.push(transaction);
                }

            }
            console.log($scope.transactions);
        });

        $scope.predicate = 'timestamp';
        $scope.reverse = true;

        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.export = function () {
            var excel = "amount,customerName\n";
            for(var i = 0; i < $scope.transactions.length; i++) {
                var obj = $scope.transactions[i];
                excel += obj.amount + "," + obj.customerName + "\n";
            }
            console.log(excel);

            var blob = new Blob([excel], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "hello world.csv");
        };

    })
    .controller('InvoiceCtrl', function($scope, Customers, Records, $state, $stateParams, appFactory, $ionicHistory) {

        $scope.user = appFactory.user;

        $scope.back = function(){
            $state.go("tab.dash");
        };

        Records.get($stateParams.recordID).then(function(data){
            $scope.record = data;
            Customers.get($scope.record.customerID).then(function(customer){
                $scope.customer = customer;

                $scope.buildInvoice();
            });
            $scope.dt = new Date($scope.record.time);

        });

        $scope.plus = function(){

        }

        $scope.buildInvoice = function(){
            console.log($scope.record.transactions);

            var info = $scope.user.name;
            if($scope.user.address1){
                info += "\n" + $scope.user.address1;
            }
            if($scope.user.address2){
                info += "\n" + $scope.user.address2;
            }
            if($scope.user.address3){
                info += "\n" + $scope.user.address3;
            }
            if($scope.user.phone){
                info += "\nPhone: " + $scope.user.phone;
            }

            $scope.invoice = {
                invoiceId: $scope.record.$id,
                date: new Date().toString(),
                myinfo: info,
                amount: $scope.record.invoice,
                subtotal: $scope.record.invoice,
                total: $scope.record.invoice,
                customer: $scope.customer.name,
                paid: $scope.record.paid,
                invoiceItems: [],
                terms: $scope.user.terms
            };

            $scope.invoiceItems = [];
            for(var i=0; i<$scope.record.transactions.length; i++){
                if($scope.record.transactions[i].type == 'invoice'){
                    $scope.invoice.invoiceItems.push($scope.record.transactions[i]);
                }
            }

            console.log($scope.invoice);
        };


    });
