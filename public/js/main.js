// module
var honeybookApp = angular.module('honeybookApp',['ngRoute','ngResource']);

// routes
honeybookApp.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'pages/home.html',
    controller: 'homeController'
  })
});

// services
honeybookApp.service('contactListService', function(){
  this.contactList = '';
});

honeybookApp.factory('mainInfo', function($http) {
    var getRecordsPromise = $http.get('https://candidate-test.herokuapp.com/contacts')
      .then(function(response){
        return response.data;
    });

    return {
        getRecords: getRecordsPromise
    };
});


honeybookApp.controller('homeController', function($scope, mainInfo){
    mainInfo.getRecords.then(function (records) {
        $scope.awesome = records;
    });
});

// vanilla JS
var msnry = new Masonry( '#card-list', {
  columnWidth: 200,
  itemSelector: '.card'
});
