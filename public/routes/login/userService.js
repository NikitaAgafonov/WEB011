module.factory("UserService", function($http, $rootScope, $timeout, $q) {
    var service = {};
    var deferred = $q.defer();
    service.userName = "";
    service.loggedIn = false;
    service.login = function(login, password) {
        $http.post("/login", {login:login, password:password})
            .success(function(res) {
                if (res) {
                    service.loggedIn = true;
                    service.userName = login;
                    console.log("logged in!");
                    deferred.resolve("logged in");
                } else {
                    console.log("wrong user/password!");
                    $rootScope.wrongPassword = true;
                    $timeout(function() {
                        $rootScope.wrongPassword = false;
                    }, 1000);
                    deferred.reject("wrong username/password");
                }
            });
        return deferred.promise;
    };
    service.logout = function() {
        return $http.get("/logout");
    };
    return service;
});