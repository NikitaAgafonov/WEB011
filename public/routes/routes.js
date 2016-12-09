var module = angular.module('myapp', ['dndLists', 'ngRoute', 'ngResource']);
module.config(
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'routes/notes/notes.html',
            controller: 'NotesController'
        }).otherwise({
            redirectTo: '/'
        });
        $routeProvider.when('/section/:name', {
            templateUrl: 'routes/viewSection/viewSection.html',
            controller: 'ViewSectionController'
        });
        $routeProvider.when('/register', {
            templateUrl: 'routes/userForm/userForm.html',
            controller: 'UserFormController'
        });
        $routeProvider.when('/:section?', {
            templateUrl: 'routes/notes/notes.html',
            controller: 'NotesController'
        });

    });