module.controller('NotesController',
    function($scope, $http, $routeParams, $location, Note) {

        /* ============================ */
        /* ========= NOTES ============ */
        /* ============================ */

        $scope.notes = [];

        // OLD SCOPE.ADD
        // $scope.add = function() {
        //     if (!$scope.text || $scope.text.length==0) return;
        //     var note = {text: $scope.text, date: new Date().getTime(), section: $scope.activeSection};
        //     $http.post("/notes", note)
        //         .success(function() {
        //             $scope.text = "";
        //             update();
        //         });
        // };

        $scope.add = function() {
            if ($scope.text.length==0) return;
            var note = new Note();
            note.text = $scope.text;
            note.section = $scope.activeSection;
            note.$save(function() {
                $scope.text = "";
                update();
            });
        };

        // OLD VAR UPDATE
        // var update = function() {
        //     var params = {params:{section:$scope.activeSection}};
        //     $http.get("/notes", params)
        //         .success(function(notes) {
        //             $scope.notes = notes;
        //         });
        // };

        var update = function() {
            $scope.notes = Note.query(
                {section:$scope.activeSection});
        };



        /* ============================ */
        /* ========= END NOTES ======== */
        /* ============================ */

        /* ============================ */
        /* ========= SECTIONS ==========*/
        /* ============================ */

        $scope.sections = {};
        $scope.activeSection = '';
        $scope.showSection = function(section) {
            $location.path(section.title);
            $scope.activeSection = section.title;
            update();
        };

        var readSections = function() {
            $http.get("/sections")
                .success(function(sections) {
                    $scope.activeSection = $routeParams.section;
                    $scope.sections = sections;
                    update();
                });
        };

        readSections();

        $scope.writeSections = function() {
            if ($scope.sections && $scope.sections.length>0) {
                $http.post("/sections/replace", $scope.sections);
            }
        };

        $scope.addSection = function() {

            if ($scope.newSection.length==0) return;
            for (var i=0;i<$scope.sections.length;i++) {
                if ($scope.sections[i].title==$scope.newSection) {
                    return;
                }
            };
            var section = {title: $scope.newSection};
            if ($scope.sections) {
                $scope.sections.unshift(section);
            } else {
                $scope.sections = section;
            }
            $scope.activeSection = $scope.newSection;
            $scope.notes.section = $scope.activeSection;
            $scope.newSection = "";
            $scope.writeSections();
            update();
        };

        /* ============================ */
        /* ======= END SECTIONS ======= */
        /* ============================ */
    });
module.factory('Note', function($resource) {
    return $resource('/notes');
});