angular.module('haikuEx')

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

  $stateProvider
    .state('nav', {
      abstract:true,
      views:{
        'topnav':{
          templateUrl:'components/nav/topnav.html',
          controller:'NavCtrl'
        },
        'main':{
          template:'<ui-view layout-fill></ui-view>'
        }
      }
    })
    .state('haikus', {
      parent:'nav',
      url:'/haikus',
      templateUrl:'haiku/haiku-list.html',
      controller:'HaikuListCtrl'
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/haikus');
})