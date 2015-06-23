'use strict';

angular.module('AniTheme').controller('ActivityCtrl', function ($scope, lodash, $http, $translate, moment) {
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

  function setData(_data, range) {
    var data = lodash.slice(_data); // deep copy array
    var groupBy = null;
    if (range === 'week') {
      groupBy = lodash.groupBy(data, function(d) {
        return new moment(d.date).startOf('week').format('YYYY-MM-DD');
      });
    } else if (range === 'month') {
      groupBy = lodash.groupBy(data, function(d) {
        return new moment(d.date).startOf('month').format('YYYY-MM-DD');
      });
    }

    if (groupBy) {
      var returnData = [];
      lodash.forEach(groupBy, function(dataOnGroup, group) {
        var aData = {date: group};

        //[{date:, activity-x:, activity-y:}, ...]
        dataOnGroup.forEach(function(d) {
          lodash.forEach(d, function(value, key) {
            key !== 'date' && (aData[key] = (aData[key] ? aData[key] : 0) + value);
          });
        });

        returnData.push(aData);
      });
      data = returnData;
    }

    $scope.activityChartOptions.chart.axis.y.max = lodash.sum(lodash.max(data, function(d) {
      return lodash.sum(d);
    }));
    $scope.activityChartOptions.data = data;
  }

  $scope.drawChart = function(kind, range) {
    if ((kind && kind === 'distance') || (range && $scope.selectedPieIndex === 1)) {
      $scope.activityChartOptions.chart.tooltip.format.value = function (value, ratio, id, index) {
        return value + 'km';
      };
      $scope.activityChartOptions.chart.axis.y.label = 'km';

      setData(distanceData, range);
      $scope.activityChartOptions.chart.grid.y.lines = (range || $scope.activityRange) === 'day' ? [{value: $scope.pie.distanceBase, text: ($scope.pie.goal === 'distance' ? $translate.instant('goal') : $translate.instant('average'))}] : []; // 목표(표준)치 라인은 일별일때만 표시
      $scope.selectedPieIndex = 1;
    } else if ((kind && kind === 'time') || (range && $scope.selectedPieIndex === 0)) {
      $scope.activityChartOptions.chart.tooltip.format.value = function (value, ratio, id, index) {
        return value + $translate.instant('min');
      };
      $scope.activityChartOptions.chart.axis.y.label = $translate.instant('min');

      setData(timeData, range);
      $scope.activityChartOptions.chart.grid.y.lines = (range || $scope.activityRange) === 'day' ? [{value: $scope.pie.timeBase, text: ($scope.pie.goal === 'time' ? $translate.instant('goal') : $translate.instant('average'))}] : [];
      $scope.selectedPieIndex = 0;
    } else if ((kind && kind === 'calory') || (range && $scope.selectedPieIndex === 2)) {
      $scope.activityChartOptions.chart.tooltip.format.value = function (value, ratio, id, index) {
        return value + $translate.instant('calories');
      };
      $scope.activityChartOptions.chart.axis.y.label = $translate.instant('calories');

      setData(caloryData, range);
      $scope.activityChartOptions.chart.grid.y.lines = (range === 'day' || $scope.activityRange) ? [{value: $scope.pie.caloryBase, text: ($scope.pie.goal === 'calory' ? $translate.instant('goal') : $translate.instant('average'))}] : [];
      $scope.selectedPieIndex = 2;
    }

    kind && ($scope.activityRange = 'day');
  };

  $scope.activityRange = 'day';

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

  $scope.baseName = function(name) {
    return $scope.pie.goal === name ? $translate.instant('goal') : $translate.instant('average');
  };

  $scope.loadData = function() {
    $http.get('/api/today').success(function(results) {
      !lodash.isEmpty(results) && ($scope.pie = results);

      // $scope.pie base 값이 먼저 들어와야 첫 grid 를 제대로 그릴 수 있음.
      $http.get('/api/activity/data').success(function(data) {
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

          // {date:x, activity-0:y, activity-1:z}
          timeData.push(time);
          distanceData.push(distance);
          caloryData.push(calory);
        });
        // default
        $scope.drawChart($scope.pie.goal);
      });
    });
  };
  $scope.loadData();

});