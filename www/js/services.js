angular.module('app.services', [])

.factory('fireBaseData', function($firebase) {
	var ref = new Firebase("https://auth-3685b.firebaseio.com/"),
    refhome = new Firebase("https://auth-3685b.firebaseio.com/home"),
    refUser = new Firebase("https://auth-3685b.firebaseio.com/users"),
  	refSubject = new Firebase("https://auth-3685b.firebaseio.com/Subject"),
    refAttendance = new Firebase("https://auth-3685b.firebaseio.com/Attendance"),
    refTime = new Firebase("https://auth-3685b.firebaseio.com/Time"),
		refActivities = new Firebase("https://auth-3685b.firebaseio.com/Activities"),
		refMenu = new Firebase("https://auth-3685b.firebaseio.com/menu")
		
		return {
		    ref: function() {
		      return ref;
		    },
		    refhome: function() {
		      return refhome;
		    },
				refAttendance: function() {
		      return refAttendance;
		    },
		    refUser: function() {
		      return refUser;
		    },
		    refCategory: function() {
		      return refCategory;
		    },
				refSubject: function() {
		      return refSubject;
		    },
		    refTime: function() {
		      return refTime;
		    },
				refActivities: function() {
		      return refActivities;
		    },
		    refFeatured: function() {
		      return refFeatured;
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

		.factory('sharedhomeService', ['$ionicPopup','fireBaseData','$firebaseArray',function($ionicPopup, fireBaseData, $firebaseArray){

		    var uid ;// uid is temporary user_id

		    var home={}; // the main Object

		    //Check if user already logged in
		    firebase.auth().onAuthStateChanged(function(user) {
		      if (user) {
		        uid=user.uid;
		        home.home_items = $firebaseArray(fireBaseData.refhome().child(uid));
		      }
		    });

		    //Add to home
		    home.add = function(item) {
		      //check if item is already added or not
		      fireBaseData.refhome().child(uid).once("value", function(snapshot) {

		        if( snapshot.hasChild(item.$id) == true ){

		          //if item is already in the home
		          var currentQty = snapshot.child(item.$id).val().item_qty;

		          fireBaseData.refhome().child(uid).child(item.$id).update({   // update
		            item_qty : currentQty+1
		          });

		        }else{

		          //if item is new in the home
		          fireBaseData.refhome().child(uid).child(item.$id).set({    // set
								name: item.name,
								id: item.id,
								group: item.group,
		          });
		        }
		      });
		    };

		    return home;
		  }])

		.factory('sharedActivitiesService', ['$ionicPopup','fireBaseData','$firebaseArray',function($ionicPopup, fireBaseData, $firebaseArray){

			    var uid ;// uid is temporary user_id

			    var Activities={}; // the main Object

			    //Check if user already logged in
			    firebase.auth().onAuthStateChanged(function(user) {
			      if (user) {
			        uid=user.uid;
			        Activities.Activities_items = $firebaseArray(fireBaseData.refActivities().child(uid));
			      }
			    });

			    //Add to home
			    Activities.add = function(item) {
			      //check if item is already added or not
			      fireBaseData.refActivities().child(uid).once("value", function(snapshot) {

			        if( snapshot.hasChild(item.$id) == true ){

			          //if item is already in the home
			          var currentQty = snapshot.child(item.$id).val().item_qty;

			          fireBaseData.refActivities().child(uid).child(item.$id).update({   // update
			            item_qty : currentQty+1
			          });

			        }else{

			          //if item is new in the home
			          fireBaseData.refActivities().child(uid).child(item.$id).set({    // set
									Activities: item.Activities,
									Activities_date: item.Activities_date,
								});
			        }
			      });
			    };

			    return Activities;
			  }])
