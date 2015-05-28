app.controller("trainersController", ["$scope", "$location", "trainersFactory", 
	function($scope, $location, trainersFactory) {

		$scope.trainers = "";


		trainersFactory.getTrainers().success(function(data, status, headers, config) {
			if(status === 200){
				$scope.trainers = data;
			}
		});
	}]);
