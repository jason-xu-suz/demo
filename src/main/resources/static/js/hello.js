angular.module('hello', [])
    .controller('home', function ($scope, $http) {
        // $scope.greeting = {id: 'spring-boot', content: 'Hello World!'};

        $http.get('/resource/').success(function (data) {
            $scope.greeting = data;
        })
    });