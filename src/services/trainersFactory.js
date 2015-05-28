app.factory("trainersFactory", ["$location", "$http", "$q", 
	function($location, $http, $q){
		return{
			
			getTrainers: function(data){
				return $http.get("http://localhost:3000/api/trainers");
			}
		};
	}]);