'use strict';

angular.module('AniTheme')
  .directive('homebody',function(){
    return {
      templateUrl:'scripts/directives/home/home-body.html?v='+window.app_version,
      restrict: 'E',
      replace: true
    }
  });
