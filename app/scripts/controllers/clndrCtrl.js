'use strict';

/**
 * @ngdoc function
 * @name AniTheme.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of AniTheme
 */
angular.module('AniTheme').controller('calendarCtrl', function ($scope, moment, amMoment) {

  amMoment.changeLocale('ko');

  $scope.config = {
    start: new Date(2015, 6, 1),
    domain: 'month',
    subDomain: 'x_day',
    cellSize: 25,
    cellPadding: 5,
    range: 1,
    label: {
      position: 'top',
      offset: {
        x: -70, y: 0
      }
    },
    weekStartOnMonday: false,
    displayLegend: false,
    legend: [0, 1],
    domainLabelFormat: function(date) {
      return new moment(date).format('YYYY년 MMM');
    },
    highlight: 'now',
    previousSelector: '#cal-previous',
    nextSelector: '#cal-next'
  };

});