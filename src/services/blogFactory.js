app.factory("blogFactory", ["$location", "$http", "$q", 
	function($location, $http, $q){
		var data;
        return {
			postBlog: function(data){
				return $http.post("http://localhost:3000/api/blog", 
					{	title	:data.title, 
						body	:data.body, 
						tags	:data.tags
					}
				);
			},

			getBlogs: function(){
				return $http.get("http://localhost:3000/api/blog");
			},
			addFavs: function(data){
				console.log("id: " + data.id);	
				return $http.put("http://localhost:3000/api/blog/meta/favs",
				{_id : data.id});
			},
			addComments: function(data){
				console.log("dataFactory: " + data.comment);	
				return $http.put("http://localhost:3000/api/blog/comment",
				{_id : data.id, comment : data.comment});
			},
		};

}]);