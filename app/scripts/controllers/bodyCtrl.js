'use strict';

angular.module('AniTheme').controller('BodyMeasurementCtrl', function ($scope, lodash, $http, $translate, moment) {
  $scope.selectedBody = {}; // {body: {name: '', unit: '', id: ''}}
  $scope.bodies = []; // body measurement list
  $scope.bodyData = null; // real data ({0: {}, 1: {}, ...} group by id)

  $http.get('/api/body').success(function(result) {
    lodash.forEach(result, function(body) {
      body.name = $translate.instant(body.name);
      $scope.bodies.push(body);
    });

    $http.get('/api/body/data').success(function(data) {
      $scope.bodyData = lodash.groupBy(data, function(d) {
        return d.body_id;
      });

      // default (0: height)
      $scope.bodyChartOptions.data = $scope.bodyData[0]; //chart data
      $scope.selectedBody.body = $scope.bodies[0]; //custom-select option
      $scope.bodyRange = 'day';
    });
  });

  // date-picker
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    showWeeks: false
  };

  // chart
  $scope.bodyChartOptions = {
    data: [],
    dimensions: {
      date: {
        axis: 'x',
        dataType: 'datetime'
      },
      value: {
        type: 'area'
      }
    },
    chart: {
      legend: {
        show: false
      },
      area: {
        zerobased: false
      },
      tooltip: {
        format: {
          name: function(name, ratio, id, index) {
            return '';
          }
        }
      },
      axis: {
        y: {

        }
      }
    }
  };

  function reloadData(body, range) {
    if (body === null) {
      body = $scope.selectedBody.body;
    }

    var data = lodash.slice($scope.bodyData[body.id]); //deep copy array

    var groupByDate = null;
    if (range === 'week') {
      groupByDate = lodash.groupBy(data, function(d) {
        return new moment(d.date).endOf('week').format('YYYY-MM-DD');
      });
    } else if (range === 'month') {
      groupByDate = lodash.groupBy(data, function(d) {
        return new moment(d.date).endOf('month').format('YYYY-MM-DD');
      });
    }
    
    if (groupByDate) {
      var groupedData = [];
      
      lodash.forEach(groupByDate, function(dataOnDate, date) {
        // sort by date ascsending
        var sortedArray = lodash.sortBy(dataOnDate, function(d) { return d.date });

        groupedData.push({
          date: date,
          value: lodash.last(sortedArray)['value'] // last value is matter
        });
      });

      data = groupedData;
    }
    
    $scope.bodyChartOptions.data = data;
    $scope.bodyChartOptions.chart.tooltip.format.value = function (value) { return value + body.unit; };
    $scope.bodyChartOptions.chart.axis.y.label = body.unit;

    body && ($scope.bodyRange = 'day');
  }

  $scope.$watch('selectedBody.body', function(newValue, oldValue) {
    if (newValue) {
      reloadData(newValue);
    }
  });

  $scope.reloadBodyData = reloadData;
});