'use strict';

angular.module('AniTheme').controller('newsCtrl', function ($scope, $http) {
  $http.get('/api/news').success(function(results) {
    $scope.feeds = results.feeds;
  });
});