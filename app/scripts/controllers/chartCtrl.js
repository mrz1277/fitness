'use strict';

/**
 * @ngdoc function
 * @name AniTheme.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of AniTheme
 */
angular.module('AniTheme').controller('ChartCtrl', function ($scope, lodash, $http, $translate, $q, moment, $interval) {
  $scope.activityChart = {
    data: [],
    columns: [],
    x: {id: 'x'}
  };

  var colors = ['#3CA2E0','#F0AD4E','#7AB67B','#D9534F','#3faae3'];
  var timeData = [], distanceData = [], caloryData = [];

  // columns
  function getActivities() {
    var deferred = $q.defer();

    $http.get('/api/activities').success(function(result) {
      var activityCount = result.activities.length;

      lodash.forEach(result.activities, function(activity, i) {
        $translate(activity.name).then(function(translatedName) {
          $scope.activityChart.columns.push({
            "id":'activity-' + i,
            "type":"bar",
            "name":translatedName,
            "color":colors[i]
          });

          $scope.activityChart.columns.length == activityCount && deferred.resolve(activityCount);
        });
      });
    }).error(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  function getData(activityCount) {
    $http.get('/api/data').success(function(data) {
      var dates = Object.keys(data);

      if (dates.length > 0) {
        var startDate = new moment(dates[0]);
        var endDate = new moment(dates[dates.length - 1]);

        var usedColumnIds = [];

        while (!startDate.isAfter(endDate)) {
          var date = new moment(startDate);
          var key = date.format('YYYY-MM-DD');

          var x = date.toDate();
          var timeValue = { x: x };
          var distanceValue = { x: x };
          var caloryValue = { x: x };

          // accumulate value
          data[key] && data[key].forEach(function (record) {
            var columnId = 'activity-' + record.activity_index;
            !lodash.includes(usedColumnIds, columnId) && usedColumnIds.push(columnId);

            timeValue[columnId] = (timeValue[columnId] ? timeValue[columnId] : 0) + record.data.time;
            distanceValue[columnId] = (distanceValue[columnId] ? distanceValue[columnId] : 0) + record.data.distance;
            caloryValue[columnId] = (caloryValue[columnId] ? caloryValue[columnId] : 0) + record.data.calory;
          });

          timeData.push(timeValue);
          distanceData.push(distanceValue);
          caloryData.push(caloryValue);

          startDate.add(1, 'day');
        }

        // exclude unused column
        $scope.activityChart.columns = lodash.filter($scope.activityChart.columns, function(column) {
          return lodash.includes(usedColumnIds, column.id);
        });
      }

      // default chart
      $scope.activityChart.data = distanceData;
    });
  }

  getActivities().then(function(activityCount) {
    getData(activityCount);
  });


  // pieOptions
  $scope.pieOptions = {
    size: 220,
    lineWidth: 10,
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
    caloryBase: 1
  };

  $http.get('/api/today').success(function(results) {
    !lodash.isEmpty(results) && ($scope.pie = results);
  });

});