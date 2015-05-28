app.factory("messagesFactory", ["$location", "$http", "$q", 
	function($location, $http, $q){
		return {

			sendMessage: function(data){
				return $http.post("http://localhost:3000/api/messages", 
					{	
						title	: data.title, 
						message	: data.message,
						recID	: data.recID
					}
				);
			},

			getMessages: function(){
				return $http.get("http://localhost:3000/api/messages");
			},

			getUsers: function(){
				return $http.get("http://localhost:3000/api/userpublicinfo");
			}
		};

	}]);