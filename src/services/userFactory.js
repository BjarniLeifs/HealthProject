app.factory("userFactory", ["$location", "$http", "$q",
	function($location, $http, $q){
	var user;

	return {
		validUser: function(email, pass){
			return $http.post("http://localhost:3000/api/login", {email : email, password : pass});
		},
		getToken: function(){
			return user.Token;
		},
		getUser: function() {
			return $http.get("http://localhost:3000/api/userinfo");
		},
		setUser: function(newUser) {
			return $http.post("http://localhost:3000/api/register", {name : newUser.name, email : newUser.email, password : newUser.password});
		},
		saveUser: function(newUser) {
			user = newUser;
		},
		getUserName: function(){
			return user.name;
		}
	};
}]);

