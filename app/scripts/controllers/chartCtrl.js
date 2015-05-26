'use strict';

/**
 * @ngdoc function
 * @name AniTheme.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of AniTheme
 */
angular.module('AniTheme').controller('ChartCtrl', function ($scope, lodash, $http) {
  $scope.line = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    data: [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ],
    colours: ['#3CA2E0','#F0AD4E','#7AB67B','#D9534F','#3faae3'],
    onClick: function (points, evt) {
      console.log(points, evt);
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };

  $scope.bar = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    data: [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ],
    colours: ['#3CA2E0','#F0AD4E','#7AB67B','#D9534F','#3faae3']

  };

  $scope.donut = {
    labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    data: [300, 500, 100],
    colours: ['#3CA2E0','#F0AD4E','#7AB67B','#D9534F','#3faae3']
  };

  $scope.pie = {
    labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    data : [300, 500, 100],
    colours: ['#3CA2E0','#F0AD4E','#7AB67B','#D9534F','#3faae3']
  };


  $scope.datapoints=[{"x":10,"top-1":10,"top-2":15},
    {"x":20,"top-1":100,"top-2":35},
    {"x":30,"top-1":15,"top-2":75},
    {"x":40,"top-1":50,"top-2":45}];
  $scope.datacolumns=[{"id":"top-1","type":"spline"},
    {"id":"top-2","type":"spline"}];
  $scope.datax={"id":"x"};

  // pieOptions
  var pieDefaultOptions = {
    size: 220,
    lineWidth: 10
  };

  $scope.pieDistanceOptions = lodash.defaults({
    onStep: function(from, to, percent) {
      $scope.distance = Math.round(percent * $scope.pie.distanceBase / 100);
    }
  }, pieDefaultOptions);
  $scope.pieTimeOptions = lodash.defaults({
    onStep: function(from, to, percent) {
      $scope.time = Math.round(percent * $scope.pie.timeBase / 100);
    }
  }, pieDefaultOptions);
  $scope.pieCaloriesOptions = lodash.defaults({
    onStep: function(from, to, percent) {
      $scope.calories = Math.round(percent * $scope.pie.caloriesBase / 100);
    }
  }, pieDefaultOptions);

  $scope.pie = {
    time: 0,
    timeBase: 1,
    distance: 0,
    distanceBase: 1,
    calories: 0,
    caloriesBase: 1
  };
  $http.get('/api/today').success(function(results) {
    $scope.pie = results;
  });

});