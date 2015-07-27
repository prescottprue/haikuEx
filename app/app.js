angular.module('haikuEx', [
    'ui.router', 
    'ngMaterial', 
    'haikuEx.const',
    'haikuEx.nav',
    
    'haikuEx.haiku'
  ])

//Set environment based on host
.service('ENV', ['$location', 'CONST', '$window', function ($location, CONST, $window){
  //TODO: Check for other environments as well (staging)
  console.log('host from window:', $window.location.host.split(":")[0])
  if($location.host() == "localhost"){
    return {fbUrl:CONST.local.FB_URL, logging:true};
  } else {
    return {fbUrl:CONST.production.FB_URL, logging:false};
  }
}])
.config(function($sceDelegateProvider, $httpProvider){
  // Whitelist Urls
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
  
  $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self'
   ]);
})
.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        console.log("$window:", $window);
        scope.getWindowDimensions = function () {
            return { 'h': w.innerHeight, 'w': w.innerWidth };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return { 
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px' 
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
})