var account = angular.module('accountModule', ['ionic', 'starter', "firebase"])

    .controller('LoginCtrl', function($scope, UserAuth, $ionicLoading, $ionicPopup, $state, Users, appFactory){
        console.log("LonginCtrl");

        $scope.user = {};

        var loadUser = function(key){
            $ionicLoading.hide();
            Users.get(key).then(function(data){
                appFactory.user = data;
                $state.transitionTo("tab.dash");
            }).catch(function(err){
                console.log(err);
            })
        };

        var fail = function(error){
            $ionicLoading.hide();
            console.error("Error: ", error);
            $ionicPopup.alert({
                title: 'Error',
                content: "An error happened"
            });
        };

        $scope.register = function(){
            $ionicLoading.show({
                content: '<i class="icon ion-looping"></i> Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            UserAuth.$createUser({email: $scope.user.email, password: $scope.user.password}).then(function (authUser) {
                console.log(authUser);
                Users.get(authUser.uid).then(function(data){
                    var user = data;
                    user.registered = Firebase.ServerValue.TIMESTAMP;
                    user.paymentMethods = ["cash", "email transfer", "check", "credit card", "debit"];
                    Users.save(user).then(function(){
                        $ionicPopup.alert({
                            title: 'Success',
                            content: "Registered Successfully"
                        });

                        UserAuth.$authWithPassword({
                            email: $scope.user.email,
                            password: $scope.user.password
                        }).then(function (ref) {
                            loadUser(ref.uid);
                        })
                    });
                });
            });
        };

        $scope.signin = function(){
            $ionicLoading.show({
                content: '<i class="icon ion-looping"></i> Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            if(UserAuth.$getAuth()){
                console.log(UserAuth.$getAuth().uid);
                loadUser(UserAuth.$getAuth().uid);
            } else {
                UserAuth.$authWithPassword({
                    email: $scope.user.email,
                    password: $scope.user.password
                }).then(function (ref) {
                    console.log(ref);
                    loadUser(ref.uid);
                }, function (error) {
                    console.error("Login failed: ", error);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        content: "Login failed, please try again"
                    });
                });
            }
        };

        if(UserAuth.$getAuth()){
            console.log(UserAuth.$getAuth());
            $scope.signin();
        }

    })

    .controller('AccountCtrl', function($scope, UserAuth, $state, $ionicPopup, appFactory) {
        $scope.logout = function(){
            UserAuth.$unauth();
            $state.go("login");
        };

        $scope.user = appFactory.user;

        $scope.save = function(){
            appFactory.userSave($scope.user).then(function(){
                $ionicPopup.alert({
                    title: 'Success',
                    content: "Your information is saved"
                });
            })
        };
    });
