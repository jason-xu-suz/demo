angular.module('hello', [])
    .controller('home', function ($scope) {
        $scope.greeting = {id: 'spring-boot', content: 'Hello World!'}
    })