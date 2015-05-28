app.controller("blogController", ["$scope", "$location", "$http", "blogFactory",
	function($scope, $location, $http, blogFactory){

		$scope.blogs="";
		
		blogFactory.getBlogs().success(function(data, status, headers, config){
			if(status === 200) {
				console.log(status);
				console.log(data);
				$scope.blogs = data;
			}
		}).error(function(){
			console.log("Error");
		}); 

		$scope.favsCounter = function(_id){
			var id = "";
			var data = {
				id   : _id,
			};
			console.log("data in favsCount: " + data);
			blogFactory.addFavs(data).success(
				function(data, status, headers, config){
				console.log(status);
				}).error(function(){
					console.log("Error");
				});

		};

		$scope.addComment = function(_id, comment){
			var id = "";
			var comments = [];
			var data = {
				id   : _id,
				comment : comment
			};
			console.log("data in comment: " + data.comment);
			blogFactory.addComments(data).success(
				function(data, status, headers, config){
				console.log(status);
				}).error(function(){
					console.log("Error");
				});

		};
}]);

