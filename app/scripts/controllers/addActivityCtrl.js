angular.module('AniTheme').controller('AddActivityCtrl', function ($scope, $http, $translate, lodash, moment) {
  $scope.activity = {};

  // activity select
  $scope.selectedActivity = {};
  $scope.activities = [];

  $http.get('/api/activity').success(function(result) {
    lodash.forEach(result, function(activity) {
      activity.name = $translate.instant(activity.name);
      $scope.activities.push(activity);
    });
  });

  // date-picker
  $scope.today = function() {
    $scope.date = new Date();
    $scope.maxDate = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.date = null;
  };

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
  $scope.timeChanged = function() {

  };

  $scope.addActivity = function() {
    // TODO validate data (integer)

    $scope.activity.activity_id = $scope.selectedActivity.activity.id;
    $scope.activity.datetime = new moment($scope.date).format('YYYY-MM-DD') + 'T' + new moment($scope.time).format('HH:mm');

    $http.post('/api/activity', $scope.activity)
      .success(function(data) {
        $scope.showGrowlSuccess = true;
        $scope.$parent.loadData();
      })
      .error(function(data, status) {
        $scope.showGrowlError = true;
      });
  }
});