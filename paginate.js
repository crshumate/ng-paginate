angular.module('modules.Paginate', [])

.filter('Paginate', function($filter) {
    return function(input, current_page, page_size) {
        if (input) {

            if (input.length > 0) {
                return $filter('limitTo')(input.slice(current_page * page_size), page_size);
            }

        }
    };
})

.directive('paginate', function() {
    return {
        restrict: "A",
        scope: {
            pagesize: '=',
            currentpage: '=',
            items: '='
        },
        controller: function($scope, $timeout) {

            //Wait until we have items to paginate before kicking off the initPagination function
            $scope.$watch('items', function(new_val, old_val) {
                if (new_val && new_val.length !== 0) {
                    $scope.initPagination();
                }
            });
            
            //Populate the page dropdown
            $scope.initPagination = function() {
                $scope.page_count = Math.ceil($scope.items.length / $scope.pagesize);
                $scope.page_select = [];

                for (var i = 0; i < this.page_count; i++) {
                    $scope.page_select.push({
                        "value": i,
                        "name": (i + 1)

                    });
                }
            };

            $scope.prevPage = function() {
                if ($scope.currentpage !== 0) {

                    $scope.currentpage -= 1;
                }
            };

            $scope.nextPage = function() {
                if ($scope.currentpage !== ($scope.page_count - 1)) {
                    $scope.currentpage += 1;
                }
            };
            $scope.nextPrev = function() {
                //We are on the first page
                if ($scope.currentpage === 0) {
                    $scope.prevDisabled = true;
                    $scope.nextDisabled = false;

                    //We are on the first and last page
                    if ($scope.currentpage === ($scope.page_count - 1)) {
                        $scope.prevDisabled = true;
                        $scope.nextDisabled = true;
                    }
                    //we are on the last page
                } else if ($scope.currentpage === ($scope.page_count - 1)) {
                    $scope.nextDisabled = true;
                    $scope.prevDisabled = false;
                    //we are on neither the first nor last pages...
                } else {
                    $scope.nextDisabled = false;
                    $scope.prevDisabled = false;
                }


            };
            //everytime digest runs we need to reevaluate where we are in the navigiation
            //to properly enable/disable next/prev arrows
            $scope.$watch(function() {
                $scope.nextPrev();
            });


        },
        templateUrl: 'paginate.tpl.html'
    };
})

;