app.factory("foodFactory", ["$location", "$http", "$q",function($location, $http, $q){
	
	return {
		getFoodByName: function(itemName) {
			return $http.get('http://localhost:3000/api/food/getByName/'+itemName);
		},

		getRecipeById: function(recipeId) {
			return $http.post('http://localhost:3000/api/recipe/get',
				{
					id :recipeId
				});
		},

		postRecipe: function(data) {
			return $http.post('http://localhost:3000/api/recipe', 
			{
				title : data.title,
				steps : data.steps,
				ingredients : data.ingredients,
				tags : data.tags
			});
		}
	};
}]);

