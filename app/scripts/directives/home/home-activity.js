'use strict';

angular.module('AniTheme')
  .directive('homeactivity',function(){
    return {
      templateUrl:'scripts/directives/home/home-activity.html?v='+window.app_version,
      restrict: 'E',
      replace: true
    }
  });
