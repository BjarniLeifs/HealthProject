app.controller('messagesController', ['$scope', "$location", "$http", "messagesFactory", 
	function($scope, $location, $http, messagesFactory){
		console.log("controller");
		$scope.tabs = [
			{
				name:	"New message",
				url:	"templates/messages/write.html"
			},
			{
				name:	"Inbox",
				url:	"templates/messages/inbox.html",
				active: true
			},
			{
				name:	"Sent",
				url:	"templates/messages/sent.html"
			},
			{
				name:	"Trash",
				url:	"templates/messages/trash.html"
			}
		];

		$scope.message = {
			recID : "",
			title : "",
			message : ""
		};

		$scope.setRec = function(user) {
			$scope.message.recID = user._id;
			$scope.message.senName = user.local.name;
		};

		messagesFactory.getUsers().success(function(data, status, headers, config) {
			if(status == 200) {
				$scope.users = data;
			}
		}).error(function(){
			$scope.users.local.name = "Error";
		});

		messagesFactory.getMessages().success(function(data, status, headers, config) {
			if(status == 200) {
				$scope.messages = data;
			}
		}).error(function(){
			$scope.messages = "Error";
		});

		$scope.sendMessage = function(){
			console.log("controller sendMessage");
			console.log($scope.message.recID);
			if($scope.message.recID !== "" && $scope.message.title !== "" && $scope.message.message !== "") {
				messagesFactory.sendMessage($scope.message);
			}
		};




	}]);
