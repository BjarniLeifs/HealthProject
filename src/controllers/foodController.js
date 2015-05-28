app.controller("foodController", ["$scope", "$location", "$http", "foodFactory", function($scope, $location, $http, foodFactory) {
	$scope.foodItem = "Empty";
	$scope.recipeItem = "Empty";

	foodFactory.getFoodByName("SKYR").success(function(data, status, headers, config){
		if(status === 200) {
			console.log(data);
			$scope.foodItem = data;

		}
	}).error(function(){
		console.log("Error");
	});
}]);