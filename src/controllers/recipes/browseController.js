app.controller("browseController", ["$scope", "$location", "foodFactory", function($scope, $location, foodFactory) {
	$scope.selected = undefined;
	
	$scope.$item = undefined;
	$scope.$model = undefined;
	$scope.$label = undefined;

	$scope.option = {A:10, B:15, C:20, D:[5.5, 30]};
	$scope.optionD = {min: 200, max: 700};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.updateTypeHead();
	};

	$scope.getName = function(name) {
		var names = name.split(", ");

		return $scope.toTitle(names[0]);
	};

	$scope.getSubName = function(name) {
		if(name.indexOf(", ") <= -1)
			return "";

		var names = name.split(", ");
		var subTitle = names[1];

		for (var i = 2; i < names.length; i++) {
			subTitle += '/' + names[i];
		}

		return $scope.toTitle(subTitle);
	};

	$scope.toTitle = function(name) {
		return (name.toLowerCase()).charAt(0).toUpperCase() + name.slice(1);
	};

	$scope.getType = function(type) {
		var num = parseInt(type, 10);

		if(isNaN(num))
			$scope.getTypeByName(type);

		if(num < 4)						//Blue
			return 'block-blue';

		if(num === 4 || num === 5)		//Yellow
			return 'block-yellow';

		if(num === 6 || num === 7)		//Green
			return 'block-green';

		if(num === 8 || num === 9)		//Red
			return 'block-red';

		if(num > 10 && num < 13)		//White
			return 'block-white';

		if(num === 16 || num === 13)	//Orange
			return 'block-orange';

		if(num === 14)					//Light Blue
			return 'block-lightBlue';

		if(num === 15)					//Gray
			return 'block-gray';

		if(num === 17)					//Red/Brown
			return 'block-redBrown';

		if(num === 18)					//Pink
			return 'block-pink';

		if(num === 19)					//Brown
			return 'block-brown';

		return 'block-defult';
	};

	$scope.getTypeByName = function(type) {
		console.log(type);
	};

	$scope.checkName = function(value) {
		if(value !== undefined && value !== null)
			return value;
		console.log("this: value returned in checkName:");
		console.log(value);
		return '-';
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

	$scope.showRecipe = function(id) {
		foodFactory.getRecipeById(id).success(function(data, status, headers, config){
			if (status === 200) {
				$scope.recipeItem = data;
				console.log(id);
				console.log(data);
				//$location.path('/login');
			}
		}).error(function() {
			console.log("Error");
		});
	};
}]);