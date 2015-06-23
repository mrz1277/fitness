'use strict';

angular.module('AniTheme').controller('BodyMeasurementCtrl', function ($scope, lodash, $http, $translate, moment) {
  $scope.body = {}; // for request body 
  $scope.selectedBody = {}; // {body: {name: '', unit: '', id: ''}}
  $scope.bodies = []; // body measurement list
  $scope.bodyData = null; // real data ({0: {}, 1: {}, ...} group by id)

  // date-picker
  $scope.today = function() {
    $scope.date = new Date();
    $scope.maxDate = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.date = null;
  };

  $scope.openBodyCalendar = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedBodyCalendar = true;
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

  function loadData() {
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
  }
  loadData();

  function drawBodyChart(body, range) {
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
      drawBodyChart(newValue);
    }
  });

  $scope.drawBodyChart = drawBodyChart;
  
  $scope.addBodyMeasurement = function() {
    // TODO validate data (integer)

    $scope.body.body_id = $scope.selectedBody.body.id;
    $scope.body.date = new moment($scope.date).format('YYYY-MM-DD');

    $http.post('/api/body', $scope.body)
      .success(function(data) {
        $scope.showBodyGrowlSuccess = true;
        loadData();
      })
      .error(function(data, status) {
        $scope.showBodyGrowlError = true;
      });
  }
});