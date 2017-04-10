angular.module('starter.services', ["firebase"])

.factory("FirebaseRef", function() {
    var ref = new Firebase('https://mybookkeepingapp.firebaseio.com/');

    return ref;
})

.factory("Users", function(FirebaseRef, $firebaseObject) {
    var ref = FirebaseRef.child("users");
    var user;

    var getUser = function(userID){
        if(user){
            return user;
        } else {
            user = $firebaseObject(ref.child(userID));
            return user;
        }
    };

    return {
        ref: function(){
            return ref;
        },

        get: function(userID){
            return getUser(userID).$loaded();
        },
        save: function(myself){
            return myself.$save();
        }
    };
})

    .factory("Credits", function(FirebaseRef, $firebaseObject, $firebaseArray, appFactory) {
        var ref = FirebaseRef.child("credits");
        var credits = $firebaseArray(ref.child(appFactory.user.$id));

        return {
            ref: function(){
                return ref;
            },
            getList: function(){
                console.log(appFactory.user.$id);
                return credits.$loaded();
            },
            getCreditsByTime: function(firstDay, lastDay){
                var credits = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("timestamp").startAt(firstDay.getTime()).endAt(lastDay.getTime()));
                return credits.$loaded();
            },
            add: function(credit){
                return credits.$add(credit);
            },
            get: function(creditId){
                var credit = $firebaseObject(ref.child(appFactory.user.$id).child(creditId));
                return credit.$loaded();
            },
            saveCreditObj: function(credit){
                return credit.$save();
            }
        };
    })

    .factory("Customers", function(FirebaseRef, $firebaseObject, $firebaseArray, appFactory) {
        var ref = FirebaseRef.child("customers");
        var customers = $firebaseArray(ref.child(appFactory.user.$id));

        return {
            ref: function(){
                return ref;
            },
            getList: function(){
                console.log(appFactory.user.$id);
                return customers.$loaded();
            },
            save: function(customerName){
                var customer = {
                    name: customerName,
                    userID: appFactory.user.$id,
                    created: Firebase.ServerValue.TIMESTAMP
                };
                return customers.$add(customer);
            },
            get: function(customerID){
                var customer = $firebaseObject(ref.child(appFactory.user.$id).child(customerID));
                return customer.$loaded();
            },
            saveCustomerObj: function(customer){
                return customer.$save();
            }
        };
    })

    .factory("Records", function(FirebaseRef, $firebaseArray, $firebaseObject, appFactory) {
        var ref = FirebaseRef.child("records");

        return {
            ref: function(){
                return ref;
            },
            getList: function(){
                var records = $firebaseArray(ref.child(appFactory.user.$id));
                return records.$loaded();
            },
            getCustomerRecords: function(customerID){
                var records = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("customerID").equalTo(customerID));
                return records.$loaded();
            },
            getUncollectedRecords: function(){
                var records = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("datePaymentCleared").equalTo(0).limitToFirst(3));
                return records.$loaded();
            },
            getUrgentRecords: function(){
                var records = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("indexedDue").endAt(2450756200346).limitToFirst(3));
                return records.$loaded();
            },
            getAllUncollectedRecords: function(){
                var records = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("datePaymentCleared").equalTo(0));
                return records.$loaded();
            },
            getAllUrgentRecords: function(){
                var records = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("indexedDue").endAt(2450756200346));
                return records.$loaded();
            },
            get: function(recordID){
                var record = $firebaseObject(ref.child(appFactory.user.$id).child(recordID));
                return record.$loaded();
            },
            add: function(record){
                var records = $firebaseArray(ref.child(appFactory.user.$id));
                return records.$add(record);
            },
            saveInArray: function(array, record){
                record.lastModifiedDate = Firebase.ServerValue.TIMESTAMP;

                return array.$save(record);
            },
            removeFromArray: function(array, record){
                return array.$remove(record )
            },
            save: function(record){
                record.lastModifiedDate = Firebase.ServerValue.TIMESTAMP;
                return record.$save();
            },
            getDueRecordsByTime: function(firstDay, lastDay){
                console.log(firstDay);
                console.log(lastDay);
                var records = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("due").startAt(firstDay.getTime()).endAt(lastDay.getTime()));
                return records.$loaded();
            },
            getCreatedRecordsByTime: function(firstDay, lastDay){
                var records = $firebaseArray(ref.child(appFactory.user.$id).orderByChild("created").startAt(firstDay.getTime()).endAt(lastDay.getTime()));
                return records.$loaded();
            }
        };
    })
.factory("appFactory", function() {
        var factory = {
            userSave: function(user){
                return user.$save();
            }
        };
        return factory;
})

.factory("UserAuth", function($firebaseAuth, FirebaseRef) {
    var loginObj = $firebaseAuth(FirebaseRef);
    return loginObj;
})