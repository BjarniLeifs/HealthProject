app.factory("calendarFactory", ["$location", "$http", function($location, $http) {
	
	return {
		setCalender: function(events) {
			$http({method: 'post', url: 'http://localhost:3000/api/calender', data: {calender: events}});
		},
		getCalender: function() {
			return $http.get('http://localhost:3000/api/calender');
		}
	};
}]);