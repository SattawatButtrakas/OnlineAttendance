angular.module('app.controllers', [])

  .controller('loginCtrl', function($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    // When the user logs out and reaches login page,
    // we clear all the history and cache to prevent back link
    $scope.$on('$ionicView.enter', function(ev) {
      if (ev.targetScope !== $scope) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
        $rootScope.extras = true;
        sharedUtils.hideLoading();
        $state.go('menu1', {}, {
          location: "replace"
        });

      }
    });

    $scope.loginEmail = function(formName, cred) {


      if (formName.$valid) { // Check if the form data is valid or not



        //Email
        firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function(result) {

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $rootScope.extras = true;
            $state.go('menu1', {}, {
              location: "replace"
            });


          },
          function(error) {
            sharedUtils.showAlert("กรุณาสมัครใช้งาน", "อีเมลนี้ยังไม่ได้สมัครใช้งาน");
          }
        );

      } else {
        sharedUtils.showAlert("กรุณากรอกข้อมูลใหม่", "ข้อมูลที่ป้อนไม่ถูกต้อง");
      }
    };
  })

  .controller('signupCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
      $state, fireBaseData, $ionicHistory) {
      $rootScope.extras = false; // For hiding the side bar and nav icon
      $scope.signupEmail = function(formName, cred) {
        if (formName.$valid) { // Check if the form data is valid or not
          sharedUtils.showLoading();

        //Main Firebase Authentication part
        firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function(result) {

          //Add name and default dp to the Autherisation table
          result.updateProfile({
            displayName: cred.name,
            photoURL: "Teach"
          }).then(function() {}, function(error) {});

          fireBaseData.refUser().child("อาจารย์").push({
            name: cred.name
          });

          //Registered OK
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
          $rootScope.extras = true;
          sharedUtils.hideLoading();
          $state.go('myhome', {}, {
            location: "replace"
          });

        }, function(error) {
          sharedUtils.hideLoading();
          sharedUtils.showAlert("กรุณากรอกอีเมลใหม่", "อีเมลนี้มีผู้สมัครใช้งานแล้ว");
        });

      } else {
        sharedUtils.showAlert("กรุณากรอกข้อมูลใหม่", "ข้อมูลที่ป้อนไม่ถูกต้อง");
      }

    }

  })

  .controller('signup0Ctrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory) {

    $rootScope.extras = false; // For hiding the side bar and nav icon
    $scope.signupEmail = function(formName, cred) {

      if (formName.$valid) { // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Main Firebase Authentication part
        firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function(result) {

          //Add name and default dp to the Autherisation table
          result.updateProfile({
            displayName: cred.name,
            photoURL: "Staff"
          }).then(function() {}, function(error) {});

          fireBaseData.refUser().child("เจ้าหน้าที่").push({
            name: cred.name
          });

          //Registered OK
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
          $rootScope.extras = true;
          sharedUtils.hideLoading();
          $state.go('menu1', {}, {
            location: "replace"
          });

        }, function(error) {
          sharedUtils.hideLoading();
          sharedUtils.showAlert("กรุณากรอกอีเมลใหม่", "อีเมลนี้มีผู้สมัครใช้งานแล้ว");
        });

      } else {
        sharedUtils.showAlert("กรุณากรอกข้อมูลใหม่", "ข้อมูลที่ป้อนไม่ถูกต้อง");
      }

    }

  })

  .controller('signupSTUCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    $scope.signupEmail = function(formName, cred) {

      if (formName.$valid) { // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Main Firebase Authentication part
        firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function(result) {

          //Add name and default dp to the Autherisation table
          result.updateProfile({
            displayName: cred.name,
            photoURL: "Stu"
          }).then(function() {}, function(error) {});

          fireBaseData.refUser().child("นักศึกษา").push({
            StudentID: cred.StudentID,
            name: cred.name
          });

          //Registered OK
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
          $rootScope.extras = true;
          sharedUtils.hideLoading();
          $state.go('menu1', {}, {
            location: "replace"
          });

        }, function(error) {
          sharedUtils.hideLoading();
          sharedUtils.showAlert("กรุณากรอกอีเมลใหม่", "อีเมลนี้มีผู้สมัครใช้งานแล้ว");
        });

      } else {
        sharedUtils.showAlert("กรุณากรอกข้อมูลใหม่", "ข้อมูลที่ป้อนไม่ถูกต้อง");
      }

    }

  })

  .controller('indexCtrl', function($scope, $rootScope, sharedUtils, $ionicHistory, $state, $ionicSideMenuDelegate, sharedhomeService) {

        //Check if user already logged in
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          $scope.user_info=user; //Saves data to user_info

          }else {

          $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
          $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $rootScope.extras = false;
          sharedUtils.hideLoading();
          $state.go('tabsController.login', {}, {location: "replace"});

        }
      });

      $scope.logout=function(){

        sharedUtils.showLoading();

        // Main Firebase logout
        firebase.auth().signOut().then(function() {


          $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
          $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

          $ionicHistory.nextViewOptions({
            historyRoot: true
          });


          $rootScope.extras = false;
          sharedUtils.hideLoading();
          $state.go('tabsController.login', {}, {location: "replace"});

        }, function(error) {
           sharedUtils.showAlert("Error","Logout Failed")
        });

      }

    })

  .controller('ProfileCtrl', function($scope, $rootScope, fireBaseData, $firebaseObject,
    $ionicPopup, $state, $window, $firebaseArray,
    sharedUtils) {
    //Bugs are most prevailing here
    $rootScope.extras = true;

    //Shows loading bar
    sharedUtils.showLoading();

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        //Accessing an array of objects using firebaseObject, does not give you the $id , so use firebase array to get $id
        $scope.addresses = $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));

        // firebaseObject is good for accessing single objects for eg:- telephone. Don't use it for array of objects
        $scope.user_extras = $firebaseObject(fireBaseData.refUser().child(user.uid));

        $scope.user_info = user; //Saves data to user_info
        //NOTE: $scope.user_info is not writable ie you can't use it inside ng-model of <input>

        //You have to create a local variable for storing emails
        $scope.data_editable = {};
        $scope.data_editable.email = $scope.user_info.email; // For editing store it in local variable
        $scope.data_editable.password = "";

        $scope.$apply();

        sharedUtils.hideLoading();

      }

    });

    $scope.save = function(extras, editable) {
      //Edit Password
      if (editable.password != "" && editable.password != null) {
        //Update Password in UserAuthentication Table
        firebase.auth().currentUser.updatePassword(editable.password).then(function(ok) {}, function(error) {});
        sharedUtils.showAlert("Account", "Password Updated");
      }

      //Edit Email
      if (editable.email != "" && editable.email != null && editable.email != $scope.user_info.email) {

        //Update Email/Username in UserAuthentication Table
        firebase.auth().currentUser.updateEmail(editable.email).then(function(ok) {
          $window.location.reload(true);
          //sharedUtils.showAlert("Account","Email Updated");
        }, function(error) {
          sharedUtils.showAlert("ERROR", error);
        });
      }

    };

    $scope.cancel = function() {
      // Simple Reload
      $window.location.reload(true);
      console.log("CANCEL");
      }

    })

  .controller('AddactivitiesControl', function ($scope,$ionicPopup,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
                                  $ionicHistory,$firebaseArray,sharedhomeService,sharedUtils) {

      //Check if user already logged in
      firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              $scope.user_info=user; //Saves data to user_info
            }else {

              $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
              $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

              $ionicHistory.nextViewOptions({
                historyRoot: true
              });
              $rootScope.extras = false;
              sharedUtils.hideLoading();
              $state.go('tabsController.login', {}, {location: "replace"});

            }
          });

          // On Loggin in to menu page, the sideMenu drag state is set to true
          $ionicSideMenuDelegate.canDragContent(true);
          $rootScope.extras=true;

      $scope.loadActivities = function() {
          sharedUtils.showLoading();
          $scope.Activities=$firebaseArray(fireBaseData.refActivities());
          sharedUtils.hideLoading();
        }

      $scope.addManipulation = function(edit_val) { // Takes care of Activities add and edit ie Activities Manipulator

          if (edit_val != null) {
            $scope.data = edit_val; // For editing Activities
            var title = "แก้ไขกิจกรรม";
            var sub_title = "";
          } else {
            $scope.data = {}; // For adding new Activities
            var title = "เพิ่มกิจกรรม";
            var sub_title = "";
          }
          // An elaborate, custom popup
          var ActivitiesPopup = $ionicPopup.show({
            template: '<input type="text"   placeholder="ชื่อกิจกรรม"  ng-model="data.name"> <br/> ' +
              '<input type="text"   placeholder="วันที่จัดกิจกรรม"  ng-model="data.Activities_date"> <br/> ',
            title: title,
            subTitle: sub_title,
            scope: $scope,
            buttons: [{
                text: 'ปิด'
              },
              {
                text: '<b>บันทึก</b>',
                type: 'button-positive',
                onTap: function(e) {
                  if (!$scope.data.name) {
                    e.preventDefault(); //don't allow the user to close unless he enters full details
                  } else {
                    return $scope.data;
                  }
                }
              }
            ]
          });

          ActivitiesPopup.then(function(res) {


            if (edit_val != null) {

              //Update  Activities
              if (res != null) { // res ==null  => close
                fireBaseData.refActivities().child(edit_val.$id).update({ // set
                  name: res.name,
                  Activities_date: res.Activities_date,
                });
              }
            } else {

              //Add new Activities
              fireBaseData.refActivities().push({ // set
                name: res.name,
                Activities_date: res.Activities_date,
              });
            }

          });

        };

        // A confirm dialog for deleting Activities
        $scope.deleteActivities = function(del_id) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'ลบกิจกรรม',
            template: 'ลบกิจกรรมนี้ใช่หรือไม่',
            buttons: [{
                text: 'ไม่',
                type: 'button-stable'
              },
              {
                text: 'ใช่',
                type: 'button-assertive',
                onTap: function() {
                  return del_id;
                }
              }
            ]
          });

          confirmPopup.then(function(res) {
            if (res) {
              fireBaseData.refActivities().child(res).remove();
            }
          });
        };

        console.log("home");
        $scope.addTohome=function(item){
          sharedhomeService.add(item);
        };

        $scope.cancel = function() {
          // Simple Reload
          $window.location.reload(true);
          console.log("CANCEL");
        }

      })

  .controller('menu2Ctrl', function($scope,$ionicPopup,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
                                  $ionicHistory,$firebaseArray,sharedhomeService,sharedUtils) {

            //Check if user already logged in
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                $scope.user_info=user; //Saves data to user_info
              }else {

                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

                $ionicHistory.nextViewOptions({
                  historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

              }
            });

            // On Loggin in to menu page, the sideMenu drag state is set to true
            $ionicSideMenuDelegate.canDragContent(true);
            $rootScope.extras=true;

            $scope.loadMenu = function() {
              sharedUtils.showLoading();
              $scope.menu=$firebaseArray(fireBaseData.refMenu());
              sharedUtils.hideLoading();
            }

            $scope.showProductInfo=function (id) {

            };
            $scope.addManipulation = function(edit_val) { // Takes care of subject add and edit ie subject Manipulator

              console.log("add");
              if (edit_val != null) {
                $scope.item = edit_val; // For editing subject
                var title = "แก้ไขรายวิชา";
                var sub_title = "";
              } else {
                $scope.item = {}; // For adding new Subject
                var title = "เพิ่มรายวิชา";
                var sub_title = "";
              }
              // An elaborate, custom popup
              var itemPopup = $ionicPopup.show({
                template: '<input type="text" placeholder="ชื่อวิชา"  ng-model="item.name"> <br/> ' +
                  '<input type="text" placeholder="รหัสวิชา" ng-model="item.id"> <br/> ' +
                  '<input type="number" placeholder="กลุ่ม" ng-model="item.group"> <br/> ',
                title: title,
                subTitle: sub_title,
                scope: $scope,
                buttons: [{
                    text: 'ปิด'
                  },
                  {
                    text: '<b>บันทึก</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                      if (!$scope.item.name || !$scope.item.id || !$scope.item.group) {
                        e.preventDefault(); //don't allow the user to close unless he enters full details
                      } else {
                        return $scope.item;
                      }
                    }
                  }
                ]
              });

              itemPopup.then(function(res) {

                if (edit_val != null) {
                  //Update  subject
                  if (res != null) { // res ==null  => close
                    fireBaseData.refMenu().child(edit_val.$id).update({ // set
                      name: item.name,
          						id: item.id,
          						group: item.group,
                    });
                  }
                } else {
                  //Add new subject
                  fireBaseData.refMenu().push({ // set
                    name: res.name,
                    id: res.id,
                    group: res.group,
                  });
                }
              });
            };

            // A confirm dialog for deleting subject
            $scope.deletesubject = function(del_id) {
              var confirmPopup = $ionicPopup.confirm({
                title: 'ลบรายวิชา',
                template: 'ต้องการลบรายวิชานี้ใช่หรือไม่',
                buttons: [{
                    text: 'ไม่',
                    type: 'button-stable'
                  },
                  {
                    text: 'ใช่',
                    type: 'button-assertive',
                    onTap: function() {
                      return del_id;
                    }
                  }
                ]
              });

              confirmPopup.then(function(res) {
                if (res) {
                  fireBaseData.refMenu().child(res).remove();
                }
              });
            };

            $scope.cancel = function() {
              // Simple Reload
              $window.location.reload(true);
              console.log("CANCEL");
            };

            console.log("home");
            $scope.addTohome=function(item){
              sharedhomeService.add(item);
            };
          })

  .controller('menu1Ctrl', function($scope, $rootScope, fireBaseData, $firebaseObject,
            $ionicPopup, $state, $window, $firebaseArray, sharedUtils, sharedhomeService, sharedActivitiesService) {

            $rootScope.extras = true;

            //Check if user already logged in
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                $scope.home = sharedhomeService.home_items;
              }
              //We dont need the else part because indexCtrl takes care of it
            });

            //Popupการเเจ้งเตือน
            $scope.At = function() {
              $state.go('Attendance');
              var alert = $ionicPopup.alert({
                title: 'แจ้งเตือน',
                template: 'ลงชื่อเข้ากิจกรรมเรียบร้อยแล้ว'
              })
              navigator.geolocation.getCurrentPosition(function(position, $scope){
              var posRef = fireBaseData.refAttendance().child("Activities");
              posRef.push({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  timestamp: Math.floor(Date.now() / 1000)
              })
            })
            }

            //Popupการเเจ้งเตือน
            $scope.Sj = function() {
              $state.go('Attendance');
              var alert = $ionicPopup.alert({
                title: 'แจ้งเตือน',
                template: 'ลงชื่อเข้าเรียนเรียบร้อยแล้ว'
              })
              navigator.geolocation.getCurrentPosition(function(position, $scope){
              var posRef = fireBaseData.refAttendance().child("subject");
              posRef.push({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  timestamp: Math.floor(Date.now() / 1000)
              })
            })
          }
        })

  .controller('AttendanceControl', function($scope, $rootScope, fireBaseData, $firebaseObject,
            $ionicPopup, $state, $window, $firebaseArray, sharedUtils, sharedhomeService, sharedActivitiesService) {

      $scope.addReport = function() {
        var alert = $ionicPopup.alert({
          title: 'แจ้งเตือน',
          template: 'เก็บข้อมูลเรียบร้อยแล้ว'
        })
      }

      $scope.GPS = function() {
      console.log('signup pressed');
      $state.go('GPS');
    }
  })

  .controller('GPSControl', function() {

    {
      var map = new google.maps.Map(document.getElementById('map'),

      {
        center: {
          lat: -34.397,
          lng: 150.644
        },
        zoom: 30
      });
      var infoWindow = new google.maps.InfoWindow({
        map: map
      });

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position, $scope) {

          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent(pos.lat + " , " + pos.lng);
          map.setCenter(pos);

        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    }
  })

  .controller('myhomeCtrl', function($scope,$rootScope,$state,sharedhomeService, sharedActivitiesService) {

    $rootScope.extras=true;

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.Activities = sharedActivitiesService.Activities_items;
        $scope.home=sharedhomeService.home_items;  // Loads users home
      }

      //Popupการเเจ้งเตือน
      $scope.Sj = function() {
        console.log('Pressed');
        $state.go('Attendance');
      }

      // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
      $scope.$on('$ionicView.enter', function(ev) {
        if(ev.targetScope !== $scope){
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
        }
      });
      }
    );
        })
