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
    subDomainTextFormat: function(date) {
      return new moment(date).format('D');
    },
    highlight: 'now',
    previousSelector: '#cal-previous',
    nextSelector: '#cal-next',
    data: '/api/cal',
    afterLoadData: function(data) {
      var calData = {};
      data.forEach(function(d) {
        calData[moment(d).format('X')] = 1;
      });
      return calData;
    },
    onClick: function(date, value) {
      //check value
      //update
      //toggle color
      if (value) {

      } else {

      }
    }
  };

});