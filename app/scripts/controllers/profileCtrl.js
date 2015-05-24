'use strict';

angular.module('AniTheme').controller('profileCtrl', function ($scope, $http) {
  $http.get('/api/profile').success(function(results) {
    $scope.user = results;
  });
});