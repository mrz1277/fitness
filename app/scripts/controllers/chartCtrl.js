'use strict';

/**
 * @ngdoc function
 * @name AniTheme.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of AniTheme
 */
angular.module('AniTheme').controller('ChartCtrl', function ($scope, lodash, $http, $translate) {
  $scope.activityChartOptions = {
    data: [],
    dimensions: {
      date: {
        axis: 'x',
        dataType: 'datetime'
      }
    },
    chart: {
      bar: {
        width: {
          ratio: 0.2
        }
      },
      data: {
        groups: [[]]
      },
      tooltip: {
        format: {

        }
      },
      axis: {
        y: {

        }
      },
      grid: {
        y: {
          show: true
        }
      }
    }
  };

  var colors = ['#3faae3','#D9534F','#7AB67B','#F0AD4E','#3CA2E0'];
  var timeData = [], distanceData = [], caloryData = [];

  $scope.changeData = function(kind) {
    if (kind === 'distance') {
      $scope.activityChartOptions.chart.tooltip.format.value = function (value, ratio, id, index) {
        return value + 'km';
      };
      $scope.activityChartOptions.chart.axis.y.max = lodash.sum(lodash.max(distanceData, function(distance) {
        return lodash.sum(distance);
      }));
      $scope.activityChartOptions.chart.axis.y.label = 'km';
      $scope.activityChartOptions.chart.grid.y.lines = [{value: $scope.pie.distanceBase, text: $translate.instant('goal')}]; // TODO
      $scope.activityChartOptions.data = distanceData;
      $scope.selectedPieIndex = 1;
    } else if (kind === 'time') {
      $scope.activityChartOptions.chart.tooltip.format.value = function (value, ratio, id, index) {
        return value + $translate.instant('min');
      };
      $scope.activityChartOptions.chart.axis.y.max = lodash.sum(lodash.max(timeData, function(time) {
        return lodash.sum(time);
      }));
      $scope.activityChartOptions.chart.axis.y.label = $translate.instant('min');
      $scope.activityChartOptions.chart.grid.y.lines = [{value: $scope.pie.timeBase, text: $translate.instant('average')}]; // TODO
      $scope.activityChartOptions.data = timeData;
      $scope.selectedPieIndex = 0;
    } else if (kind === 'calory') {
      $scope.activityChartOptions.chart.tooltip.format.value = function (value, ratio, id, index) {
        return value + $translate.instant('calories');
      };
      $scope.activityChartOptions.chart.axis.y.max = lodash.sum(lodash.max(caloryData, function(calory) {
        return lodash.sum(calory);
      }));
      $scope.activityChartOptions.chart.axis.y.label = $translate.instant('calories');
      $scope.activityChartOptions.chart.grid.y.lines = [{value: $scope.pie.caloryBase, text: $translate.instant('average')}]; // TODO
      $scope.activityChartOptions.data = caloryData;
      $scope.selectedPieIndex = 2;
    }
  };


  // pieOptions
  $scope.pieOptions = {
    size: 220,
    lineWidth: 15,
    scaleColor: false,
    barColor: '#3ca2e0'
  };

  // default
  $scope.pie = {
    time: 0,
    timeBase: 1,
    distance: 0,
    distanceBase: 1,
    calory: 0,
    caloryBase: 1,
    goal:'time'
  };

  $http.get('/api/today').success(function(results) {
    !lodash.isEmpty(results) && ($scope.pie = results);

    // $scope.pie base 값이 먼저 들어와야 첫 grid 를 제대로 그릴 수 있음.
    $http.get('/api/data').success(function(data) {
      var groupByDate = {};

      data.forEach(function(d) {
        var activityId = 'activity-' + d.activity_id;

        if (!$scope.activityChartOptions.dimensions[activityId]) {
          $translate(activityId).then(function(translatedName) {
            $scope.activityChartOptions.dimensions['activity-' + d.activity_id] = {
              type: 'bar',
              //color: colors.pop(),
              name: translatedName
            }
          });
          $scope.activityChartOptions.chart.data.groups[0].push(activityId);
        }

        groupByDate[d.date] ? groupByDate[d.date].push(d) : (groupByDate[d.date] = [d]);
      });

      // { '2015-06-01: [{$1}, {$2}, {$1'}]', ... }
      lodash.forEach(groupByDate, function(activitiesOnDate, date) {
        var time = {date: date}, distance = {date:date}, calory = {date:date};

        activitiesOnDate.forEach(function(activity) {
          var activityId = 'activity-' + activity.activity_id;
          time[activityId] = (time[activityId] ? time[activityId] : 0) + activity.time;
          distance[activityId] = (distance[activityId] ? distance[activityId] : 0) + activity.distance;
          calory[activityId] = (calory[activityId] ? calory[activityId] : 0) + activity.calory;
        });

        timeData.push(time);
        distanceData.push(distance);
        caloryData.push(calory);
      });
      // default
      $scope.changeData($scope.pie.goal);
    });
  });

});