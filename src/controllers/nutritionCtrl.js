app.controller("addCtrl", ["$scope", "$location", "foodFactory", function($scope, $location, foodFactory) {
	$scope.ingredients = [];
	$scope.foods = {};
	$scope.name = "";

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
		if($scope.name === "") {
			$scope.foods = {};
			return;
		}

		foodFactory.getFoodByName($scope.name).success(function(data, status, headers, config){
			if(status === 200) {
				$scope.foods = data;
			}
		}).error(function(){
			console.log("Error");
		});
	};
}]);