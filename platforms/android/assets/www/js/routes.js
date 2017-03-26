angular.module('app.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('tabsController', {
        url: '/page1',
        templateUrl: 'templates/tabsController.html',
        abstract: true
      })

      .state('tabsController.login', {
        url: '/page5',
        views: {
          'tab1': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      })

      .state('tabsController.SignupMenu', {
        url: '/SignupMenu',
        views: {
          'tab3': {
            templateUrl: 'templates/SignupMenu.html',
            controller: 'SignupMenuControl'
          }
        }
      })

      .state('tabsController.signup', {
        url: '/page6',
        views: {
          'tab3': {
            templateUrl: 'templates/signup.html',
            controller: 'signupCtrl'
          }
        }
      })

      .state('tabsController.signupSTU', {
        url: '/page2',
        views: {
          'tab3': {
            templateUrl: 'templates/signupSTU.html',
            controller: 'signupCtrl'
          }
        }
      })

      .state('menu2', {
        url: '/page7',
        templateUrl: 'templates/menu2.html',
        controller: 'menu2Ctrl'
      })

      .state('Profile', {
        url: '/page12',
        templateUrl: 'templates/Profile.html',
        controller: 'ProfileCtrl'
      })

      .state('SignupMenu', {
        url: '/SignupMenu',
        templateUrl: 'templates/SignupMenu.html',
        controller: 'SignupMenuControl'
      })

      .state('Addactivities', {
        url: '/Addactivities',
        templateUrl: 'templates/Addactivities.html',
        controller: 'AddactivitiesControl'
      })

      .state('SubjectsSystem', {
        url: '/SubjectsSystem',
        templateUrl: 'templates/SubjectsSystem.html',
        controller: 'SubjectsSystemControl'
      })

      .state('Attendance', {
        url: '/Attendance',
        templateUrl: 'templates/Attendance.html',
        controller: 'AttendanceControl'
      })

      .state('ATT_Home',{
          url:'/ATT_Home',
          templateUrl:'templates/ATT_Home.html',
          controller:'ATT_HomeControl'
        })

    $urlRouterProvider.otherwise('/page1/page5')

  });
