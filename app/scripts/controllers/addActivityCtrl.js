angular.module('AniTheme').controller('AddActivityCtrl', function ($scope, $http, $translate, lodash) {
  $scope.selectedActivities = {};
  $http.get('/api/activities').success(function(result) {
    $scope.activities = result.activities;
  });
});