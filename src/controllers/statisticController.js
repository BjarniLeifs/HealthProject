app.controller("statisticController", ["$scope", "$location", function($scope, $location) {
    $scope.dataStorage = {
        data1: [[3,7,9,1,4,6,8,2,5]],
        data2: [[8,7,2,1,3,4,6,8,5]],
        data3: [[9,8,7,6,5,4,3,2,1]],
        data4: [[3,7,9,1,4,6,8,2,5]],
        data5: [[8,8,8,8,0,8,8,8,8]],
        data6: [[9,0,9,0,9,0,9,0,9]]
    };

    $scope.plots = {
        data1: null,
        data2: null,
        data3: null,
        data4: null,
        data5: null,
        data6: null,
    };

    $scope.options = {
        title: 'This',
        grid: {
            background: 'rgb(245, 245, 245)'
        }
    };

    $scope.repaint = function(plotClass) {
        var plots = $('.' + plotClass), data, plot;

        //Wait 10ms before reploting
        setTimeout(function (){
            $(plots).each(function() {
                data = $(this).attr('ui-chart').split('.')[1];

                if($scope.plots[data] === null) {
                    $scope.plots[data] = $.jqplot(this.id, $scope.dataStorage[data], $scope.options);
                }

                if($scope.plots[data]._drawCount === 0)
                    plot.replot();

            });
        }, 10);
    };

    $scope.destroy = function(plotClass) {
        var plots = $('.' + plotClass), data, plot;

        $(plots).each(function() {
            data = $(this).attr('ui-chart').split('.')[1];
            plot = $.jqplot(this.id, $scope.dataStorage[data]);
            plot.destroy();
        });
    };

    angular.element(document).ready(function () {
        setTimeout(function() { 
            $scope.destroy('plotNutrients');
            $scope.repaint('plotNutrients');
        }, 1000);
    });
}]);