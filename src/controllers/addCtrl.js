app.controller("addCtrl", ["$scope", "$location", function($scope, $location) {
	$scope.ingredients = [];

	$scope.addIngredient = function() {
		if($scope.name === "" || $scope.amount === "" || $scope.type === "")
			return;

		$scope.ingredients.push({
			name: $scope.name,
			amount: $scope.amount,
			type: $scope.type
		});

		$scope.name = "";
		$scope.amount = "";  
		$scope.type = "";
	};

	$scope.removeIngredient = function(index) {
		$scope.ingredients.splice(index, 1);
	};

	$scope.updateTypeHead = function() {
		//Handels Empty string
		if($scope.selected === "") {
			$scope.food = {};
			return;
		}



		foodFactory.getFoodByName($scope.selected).success(function(data, status, headers, config){
			if(status === 200) {
				$scope.food = data;
			}
		}).error(function(){
			console.log("Error");
		});
	};

}]);