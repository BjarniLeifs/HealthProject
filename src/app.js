var app = angular.module("BerryApp", ['ngRoute', 'ngDragDrop', 'ui.bootstrap', 'ui.slider', 'ui.chart', 'ui.calendar']);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider.when("/", {
		templateUrl: "templates/Main.html",
		controller: "MainController",
	}).when("/login", {
		templateUrl: "templates/LogIn.html",
		controller: "loginController",
	}).when("/newblog", {
		templateUrl: "templates/newBlog.html",
		controller: "newBlogController",
	}).when("/blogs", {
		templateUrl: "templates/blogs.html",
		controller: "blogController",
	}).when("/profile", {
		templateUrl: "templates/profile.html",
		controller: "profileController",
	}).when("/checkin", {
		templateUrl: "templates/checkin.html",
		controller: "checkinController",
	}).when("/nutritionopz", {
		templateUrl: "templates/food/nutritionopz.html",
		controller: "nutritionopzController",
	}).when("/recipes/browse", {
		templateUrl: "templates/recipes/browse.html",
		controller: "browseController",
	}).when("/recipes/view/:id", {
		templateUrl:"templates/recipes/view.html",
		controller: "browseController",
	}).when("/messages", {
		templateUrl: "templates/messages/messages.html",
		controller: "messagesController",
	}).when("/trainers", {
		templateUrl: "templates/trainers.html",
		controller: "trainersController",
	}).when("/add", {
		templateUrl: "templates/recipes/add.html",
		controller: "addController",
	});
	
	//$locationProvider.html5Mode(true);
}]);
