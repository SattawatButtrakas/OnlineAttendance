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
        $state.go('menu2', {}, {
          location: "replace"
        });

      }
    });


    $scope.loginEmail = function(formName, cred) {


      if (formName.$valid) { // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Email
        firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function(result) {

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $rootScope.extras = true;
            sharedUtils.hideLoading();
            $state.go('menu2', {}, {
              location: "replace"
            });

          },
          function(error) {
            sharedUtils.hideLoading();
            sharedUtils.showAlert("Please note", "Authentication Error");
          }
        );

      } else {
        sharedUtils.showAlert("Please note", "Entered data is not valid");
      }
    };
  })

  .controller('signupCtrl', function($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
    $state, fireBaseData, $ionicHistory) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    $scope.RE = /^[a-zA-Zก-ฮ่้ัีิ์ืเาุู๊ ]{1,25}$/;
    $scope.NE = /^[0-9 ]{1,8}$/;
    $scope.Email = /^([0-9])\d+@([\bkmitl()?\b])+\.([a])+c+\.+th/;
    $scope.signupEmail = function(formName, cred) {

      if (formName.$valid) { // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Main Firebase Authentication part
        firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function(result) {

          //Add name and default dp to the Autherisation table
          result.updateProfile({
            displayName: cred.name,
            photoURL: "default_dp"
          }).then(function() {}, function(error) {});

          //Add Name to the user table
          fireBaseData.refUser().child(result.uid).set({
            Name: cred.name
          });

          //Add StudentID to the user table
          fireBaseData.refUser().child(result.StudentID).set({
            StudentID: cred.StudentID
          });

          //Registered OK
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $ionicSideMenuDelegate.canDragContent(true); // Sets up the sideMenu dragable
          $rootScope.extras = true;
          sharedUtils.hideLoading();
          $state.go('menu2', {}, {
            location: "replace"
          });

        }, function(error) {
          sharedUtils.hideLoading();
          sharedUtils.showAlert("Please note", "Sign up Error");
        });

      } else {
        sharedUtils.showAlert("Please note", "Entered data is not valid");
      }

    }

  })

  .controller('indexCtrl', function($scope, $rootScope, sharedUtils, $ionicHistory, $state, $ionicSideMenuDelegate, sharedCartService) {

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user_info = user; //Saves data to user_info
      }
    });

    $scope.logout = function() {

      sharedUtils.showLoading();

      // Main Firebase logout
      firebase.auth().signOut().then(function() {


        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });


        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {
          location: "replace"
        });

      }, function(error) {
        sharedUtils.showAlert("Error", "Logout Failed")
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

  .controller('AddactivitiesControl', function($scope, $rootScope, fireBaseData, $firebaseObject,
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
        $scope.Activities = $firebaseArray(fireBaseData.refUser().child(user.uid).child("Activities"));

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

    $scope.addManipulation = function(edit_val) { // Takes care of Activities add and edit ie Activities Manipulator


      if (edit_val != null) {
        $scope.data = edit_val; // For editing Activities
        var title = "Edit Activities";
        var sub_title = "Edit your Activities";
      } else {
        $scope.data = {}; // For adding new Activities
        var title = "Add Activities";
        var sub_title = "Add your new Activities";
      }
      // An elaborate, custom popup
      var ActivitiesPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="Activities_name"  ng-model="data.Activities_name"> <br/> ',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [{
            text: 'Close'
          },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.Activities_name) {
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
            fireBaseData.refUser().child($scope.user_info.uid).child("Activities").child(edit_val.$id).update({ // set
              Activities_name: res.Activities_name,
            });
          }
        } else {
          //Add new Activities
          fireBaseData.refUser().child($scope.user_info.uid).child("Activities").push({ // set
            Activities_name: res.Activities_name,
          });
        }

      });

    };

    // A confirm dialog for deleting Activities
    $scope.deleteActivities = function(del_id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Activities',
        template: 'Are you sure you want to delete this Activities',
        buttons: [{
            text: 'No',
            type: 'button-stable'
          },
          {
            text: 'Yes',
            type: 'button-assertive',
            onTap: function() {
              return del_id;
            }
          }
        ]
      });

      confirmPopup.then(function(res) {
        if (res) {
          fireBaseData.refUser().child($scope.user_info.uid).child("Activities").child(res).remove();
        }
      });
    };

    $scope.save = function(extras, editable) {
      //1. Edit Telephone doesnt show popup 2. Using extras and editable  // Bugs
      if (extras.telephone != "" && extras.telephone != null) {
        //Update  Telephone
        fireBaseData.refUser().child($scope.user_info.uid).update({ // set
          telephone: extras.telephone
        });
      }

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

  .controller('SubjectsSystemControl', function($scope, $rootScope, fireBaseData, $firebaseObject,
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
        $scope.subject = $firebaseArray(fireBaseData.refUser().child(user.uid).child("subject"));

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

    $scope.addManipulation = function(edit_val) { // Takes care of subject add and edit ie subject Manipulator


      if (edit_val != null) {
        $scope.data = edit_val; // For editing subject
        var title = "Edit Subject";
        var sub_title = "Edit your Subject";
      } else {
        $scope.data = {}; // For adding new Subject
        var title = "Add Subject";
        var sub_title = "Add your new Subject";
      }
      // An elaborate, custom popup
      var subjectPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="Subject_name"  ng-model="data.Subject_name"> <br/> ' +
          '<input type="number"   placeholder="Subject_id" ng-model="data.Subject_id"> <br/> ' +
          '<input type="number" placeholder="Group" ng-model="data.group"> <br/> ',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [{
            text: 'Close'
          },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.Subject_name || !$scope.data.Subject_id || !$scope.data.group) {
                e.preventDefault(); //don't allow the user to close unless he enters full details
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });

      subjectPopup.then(function(res) {

        if (edit_val != null) {
          //Update  subject
          if (res != null) { // res ==null  => close
            fireBaseData.refUser().child($scope.user_info.uid).child("subject").child(edit_val.$id).update({ // set
              Subject_name: res.Subject_name,
              Subject_id: res.Subject_id,
              group: res.group,
            });
          }
        } else {
          //Add new subject
          fireBaseData.refUser().child($scope.user_info.uid).child("subject").push({ // set
            Subject_name: res.Subject_name,
            Subject_id: res.Subject_id,
            group: res.group,
          });
        }

      });

    };

    // A confirm dialog for deleting subject
    $scope.deletesubject = function(del_id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete subject',
        template: 'Are you sure you want to delete this subject',
        buttons: [{
            text: 'No',
            type: 'button-stable'
          },
          {
            text: 'Yes',
            type: 'button-assertive',
            onTap: function() {
              return del_id;
            }
          }
        ]
      });

      confirmPopup.then(function(res) {
        if (res) {
          fireBaseData.refUser().child($scope.user_info.uid).child("subject").child(res).remove();
        }
      });
    };

    $scope.save = function(extras, editable) {
      //1. Edit Telephone doesnt show popup 2. Using extras and editable  // Bugs
      if (extras.telephone != "" && extras.telephone != null) {
        //Update  Telephone
        fireBaseData.refUser().child($scope.user_info.uid).update({ // set
          telephone: extras.telephone
        });
      }

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

  .controller('SignupMenuControl', function($scope, $state) {
    console.log('SignupMenu START.');

    $scope.btngosignup = function() {
      console.log('signup pressed.');
      $state.go('tabsController.signup');
    }

    $scope.btngosignupSTU = function() {
      console.log('signupSTU pressed.');
      $state.go('tabsController.signupSTU');
    }
  })

  .controller('menu2Ctrl', function($scope, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state,
    $ionicHistory, $firebaseArray, sharedCartService, sharedUtils, $ionicPopup) {
    console.log('MANU START.');

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user_info = user; //Saves data to user_info
      } else {

        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {
          location: "replace"
        });

      }
    });

    //จำลอง data Subjecte
    $scope.Subject = [{
        name: 'COMPUTER SECURTY',
        id: 1
      },
      {
        name: 'ENGINEERING MATHMATIC',
        id: 2
      },
      {
        name: 'DATA STRUCTURE',
        id: 3
      },
      {
        name: 'DATABASE SYSTEM',
        id: 4
      },
    ];
    //Popupการเเจ้งเตือน
    $scope.Sj = function() {
      var alert = $ionicPopup.alert({
        title: 'แจ้งเตือน',
        template: 'ลงชื่อเข้าเรียนเรียบร้อยแล้ว'
      })
    }

    //จำลอง data Activities
    $scope.Activities = [{
        name: 'รับน้อง',
        id: 1
      },
      {
        name: 'ไหว้ครู',
        id: 2
      },
      {
        name: 'ปัจฉิมนิเทศน์',
        id: 3
      },
      {
        name: 'อบรม',
        id: 4
      },
    ];
    //Popupการเเจ้งเตือน
    $scope.At = function() {
      var alert = $ionicPopup.alert({
        title: 'แจ้งเตือน',
        template: 'ลงชื่อเข้ากิจกรรมเรียบร้อยแล้ว'
      })
    }
  })

  .controller('AttendanceControl', function($scope, $state, $ionicPopup) {
    console.log('Attendance START.');

    var ctrl = this;

    ctrl.add = add;
    $scope.ctrl = [{
        Name: "Sattawat",
        Time: "09:00",
        Date: 26032016,
        Places: "KMITL"
      },
      {
        Name: "Kittichai",
        Time: "09:00",
        Date: 26032016,
        Places: "KMITL"
      },
    ]

    ////////
    function add(index) {
      window.alert("Added: " + index);
    }

  })

  .controller('ATT_HomeControl',function($scope, $state, $ionicPopup) {
     console.log('ATT_Home START.');

    //จำลอง data Subjecte
    $scope.Subject = [
        {name: 'COMPUTER SECURTY', id: 1},
        {name: 'EDUCATIONAL COMPUTER TECHNOLOGY', id: 2},
        {name: 'TECHNOLOGY PHOTOGRAPHY', id: 3},
        {name: 'ENGINEERING MATHMATIC', id: 4},
        ];

    //จำลอง data Activities
    $scope.Activities = [
    {name: 'รับน้อง', id: 1},
    {name: 'ไหว้ครู', id: 2},
    {name: 'ปัจฉิมนิเทศน์', id: 3},
    {name: 'อบรม', id: 4},
  		];
 });
