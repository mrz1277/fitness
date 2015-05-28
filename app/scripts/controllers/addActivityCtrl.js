angular.module('AniTheme').controller('AddActivityCtrl', function ($scope, $http, $translate, lodash, moment) {
  // activity select
  $scope.selectedActivities = {};
  $scope.activities = [];

  $http.get('/api/activities').success(function(result) {
    lodash.forEach(result.activities, function(value, key, activity) {
      $translate(activity[key].name).then(function(translatedName) {
        $scope.activities.push(translatedName);
      });
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

  // time-picker
  var current = new moment(new Date());
  var minute_1 = current.minute() % 10;
  var minute_10 = current.minute() - minute_1;
  minute_1 % 10 > 5 && current.minute(minute_10+5);
  minute_1 % 10 < 5 && current.minute(minute_10);
  $scope.time = current.toDate();

  $scope.changed = function () {

  };
});