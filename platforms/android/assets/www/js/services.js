angular.module('app.services', [])

.factory('fireBaseData', function($firebase) {
	var ref = new Firebase("https://auth-3685b.firebaseio.com/"),
    refUser = new Firebase("https://auth-3685b.firebaseio.com/users"),
    refSubject = new Firebase("https://auth-3685b.firebaseio.com/Subject"),
    refAttendance = new Firebase("https://auth-3685b.firebaseio.com/Attendance"),
    refTime = new Firebase("https://auth-3685b.firebaseio.com/Time"),
		refActivities = new Firebase("https://auth-3685b.firebaseio.com/Activities");
		refMenu = new Firebase("https://exam-c2d16.firebaseio.com/menu");

  return {
    ref: function() {
      return ref;
    },
    refUser: function() {
      return refUser;
    },
		refSubject: function() {
      return refSubject;
    },
    refOrder: function() {
      return refOrder;
    },
    refTime: function() {
      return refTime;
    },
		refActivities: function() {
      return refActivities;
    },
		refMenu: function() {
      return refMenu;
    }
  }
})

.factory('sharedUtils',['$ionicLoading','$ionicPopup', function($ionicLoading,$ionicPopup){

	    var functionObj={};

	    functionObj.showLoading=function(){
	      $ionicLoading.show({
	        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
	        animation: 'fade-in', // The animation to use
	        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
	        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
	        showDelay: 0 // The delay in showing the indicator
	      });
	    };
	    functionObj.hideLoading=function(){
	      $ionicLoading.hide();
	    };


	    functionObj.showAlert = function(title,message) {
	      var alertPopup = $ionicPopup.alert({
	        title: title,
	        template: message
	      });
	    };

	    return functionObj;

	}])

.factory('sharedCartService', ['$ionicPopup','fireBaseData','$firebaseArray',function($ionicPopup, fireBaseData, $firebaseArray){

    var uid ;// uid is temporary user_id
    var cart={}; // the main Object

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        uid=$rootScope.extras;
        }
    });

    return cart;
  }])
