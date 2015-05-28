app.controller("newBlogController", ["$scope", "$location", "$http", "blogFactory",
	function($scope, $location, $http, blogFactory){
		$scope.newBlog = {
			title : "",
			body : "",
			tags : ""
		};
		$scope.AddBlog = function(){
			if(!($scope.newBlog.title || $scope.newBlog.body)){
				return;
			}
			var tagArray = $scope.newBlog.tags.split(" ");
			var data = {
				title : $scope.newBlog.title,
				body : $scope.newBlog.body,
				tags : tagArray
			};
			console.log(data);
			blogFactory.postBlog(data).success(function(data, status, headers, config){
				console.log(status);
				if(status === 200) {
					$location.path("/blogs");
					$scope.$apply();
				}
				}).error(function(){
					console.log("Error");
				});
			};

	}]);