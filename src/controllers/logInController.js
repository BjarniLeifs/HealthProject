app.controller("loginController", ["$scope", "$location", "$http", "userFactory",function($scope, $location, $http, userFactory){
	$scope.reg = {name: '', email: '', password:'', conpassword: ''};
	$scope.errorMsg = "";
	$scope.email = "";
	$scope.pass = "";

	$scope.connect = function(){
		if(!($scope.email || $scope.pass))
			return;

		userFactory.validUser($scope.email, $scope.pass).success(function(data, status, headers, config){
			if(status === 200) {
				if(data === 'Failed to authenticate') {
					$scope.errorMsg = data;
				} else if(data === 'Successfully authenticated') {
					$location.path("/");
				}
			}

			$scope.email = "";
			$scope.pass = "";
		}).error(function(){
			$scope.errorMsg = "Failed to authenticate";
			$scope.email = "";
			$scope.pass = "";
		});
	};

	$scope.register = function(){
		if(!$scope.reg)
			return;

		userFactory.setUser($scope.reg).success(function(data, status, headers, config){
			if (status === 200) {
				$location.path("/");
			}
		}).error(function(){
			console.log("Error");
		});

	};
}]);
