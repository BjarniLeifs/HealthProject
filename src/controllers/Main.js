app.controller("MainController", ["$scope", "$location", "userFactory", "calendarFactory", function($scope, $location, userFactory, calendarFactory) {
	$scope.templates = [{url: '/templates/home.html', lastPath:'home.html'}];
	$scope.isSideBar = true;
	$scope.events = [];
	$scope.eventSource = {};
	$scope.user = "";

	$scope.calendarConfig = {
		height: $(document).height(),
		editable: true,
		defaultView: 'agendaDay', 
		header: {
			left: '',
			center: '',
			right: ''
		},
	};

	userFactory.getUser().success(function(data, status, headers,config) {
		if (data === "Not logged in") {
			$location.path("/login");
		}
		
		$scope.user = data.local;
		userFactory.saveUser(data.local);
	}).error(function(){
		$location.path("/login");
	});

	calendarFactory.getCalender().success(function(data, status, headers, config){
		if(status === 200) {
			if(data !== "") {   //Ignore empty
				for(var i = 0; i < data.calenderObj.length; i++) {
					$scope.events.push(data.calenderObj[i]);
				}
			}
		}
	}).error(function(){
		console.log("Error");
	});

	$scope.setTemplate = function(path, hide, $event) {
		if($scope.templates[0].lastPath != path) {
			$scope.templates = [{url: "/templates/" + path, lastPath:path}];
			$scope.setSelect($event);
		}

		if(hide !== undefined)
			if($scope.isSideBar !== hide)
				$scope.isSideBar = hide;

	};

	$scope.setSelect = function($event) {
		$(".cp-menu li a").removeClass("active");
		$($event.currentTarget.children[0]).addClass('active');
	};

	$scope.getTemplate = function() {
		return name;
	};

	$scope.eventSources = [$scope.events];
}]);