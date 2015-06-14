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

angular.module('ui.chart', [])
  .directive('uiChart', function () {
    return {
      restrict: 'EACM',
      template: '<div></div>',
      replace: true,
      link: function (scope, elem, attrs) {
        var renderChart = function () {
          var data = scope.$eval(attrs.uiChart);
          elem.html('');
          if (!angular.isArray(data)) {
            return;
          }

          var opts = {};
          if (!angular.isUndefined(attrs.chartOptions)) {
            opts = scope.$eval(attrs.chartOptions);
            if (!angular.isObject(opts)) {
              throw 'Invalid ui.chart options attribute';
            }
          }

          elem.jqplot(data, opts);
        };

        scope.$watch(attrs.uiChart, function () {
          renderChart();
        }, true);

        scope.$watch(attrs.chartOptions, function () {
          renderChart();
        });
      }
    };
  });
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
app.controller("CalendarCtrl", ["$scope", "$location", "calendarFactory", function($scope, $location, calendarFactory) {
  $scope.events = [];
  $scope.eventSource = {};

  $scope.list = {
    Food: [
      {name: 'Sandwich'}
    ],
    Recipes: [
      {name: 'French Chocolate Cake'}
    ],
    Activities: [
      {name: 'Cycling'}
    ]
  };

  $scope.calendarConfig = {
    height: $(document).height() * 0.9,
    editable: true,
    header: {
      left: 'today prev,next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    droppable: "*",
    drop: function(date, allDay, jsEvent, ui) {
      $scope.$apply(function () {
        $scope.events.push({
          title: ui.helper[0].innerText,
          start: date,
          end: date,
          className: [ui.helper[0].attributes[0].value]
        });
      });

      $scope.update();
    },
    dayClick: function(date, allDay, jsEvent, view) {
      if(allDay) {
        if($(jsEvent.target).is('.fc-day')) {
          $scope.planner.fullCalendar('changeView', 'agendaDay').fullCalendar('gotoDate', date.getFullYear(), date.getMonth(), date.getDate());
        }
      }
    },
    eventDragStop: function(event, jsEvent, ui, view) { 
      $scope.update();
    },
    eventResizeStop: function(event, jsEvent, ui, view) {
      $scope.update();
    },
    eventRender: function(event, element) {
      element.bind('dblclick', function(event) {
        var name = this.childNodes[0].innerText;
        
        for(var i = 0; i < $scope.events.length; i++) {
          if($scope.events[i].title === name) {
            //Remove Event
            $scope.events.splice(i,1);
            $scope.update();
            break;
          }
        }
      });
    }
  };

  calendarFactory.getCalender().success(function(data, status, headers, config) {
    if(status === 200) {
      if(data !== "") {   //Ignore empty
        for(var i = 0; i < data.calenderObj.length; i++) {
          $scope.events.push({
            title: data.calenderObj[i].title,
            start: data.calenderObj[i].start,
            end: data.calenderObj[i].end,
            className: data.calenderObj[i].className
          });
        }
      }
    }
  }).error(function(){
    console.log("Error");
  });

  $scope.update = function() {
    calendarFactory.setCalender($scope.events);
  };

  $scope.listRemove = function(index, type) {
    $scope.list[type].splice(index,1);
  };

  //Get Calander Width
  $scope.getWidth = function() {
    return ($(document).width() - ((($(document).width() * 0.1666666667) * 2 )));
  };

  angular.element(document).ready(function () {
    //Refresh Calender after animation
    setTimeout(function() {  $('#calender').fullCalendar('refresh'); }, 2000);
  });

  $scope.claendarWraper = {width: $scope.getWidth()};
  $scope.eventSources = [$scope.events];
}]);
app.controller("addCtrl", ["$scope", "$location", function($scope, $location) {
	$scope.ingredients = [];

	$scope.addIngredient = function() {
		if($scope.name === "" || $scope.amount === "" || $scope.type === "")
			return;

		$scope.ingredients.push({
			name: $scope.name,
			amount: $scope.amount,
			type: $scope.type
		});

		$scope.name = "";
		$scope.amount = "";  
		$scope.type = "";
	};

	$scope.removeIngredient = function(index) {
		$scope.ingredients.splice(index, 1);
	};

	$scope.updateTypeHead = function() {
		//Handels Empty string
		if($scope.selected === "") {
			$scope.food = {};
			return;
		}



		foodFactory.getFoodByName($scope.selected).success(function(data, status, headers, config){
			if(status === 200) {
				$scope.food = data;
			}
		}).error(function(){
			console.log("Error");
		});
	};

}]);
app.controller("blogController", ["$scope", "$location", "$http", "blogFactory",
	function($scope, $location, $http, blogFactory){

		$scope.blogs="";
		
		blogFactory.getBlogs().success(function(data, status, headers, config){
			if(status === 200) {
				console.log(status);
				console.log(data);
				$scope.blogs = data;
			}
		}).error(function(){
			console.log("Error");
		}); 

		$scope.favsCounter = function(_id){
			var id = "";
			var data = {
				id   : _id,
			};
			console.log("data in favsCount: " + data);
			blogFactory.addFavs(data).success(
				function(data, status, headers, config){
				console.log(status);
				}).error(function(){
					console.log("Error");
				});

		};

		$scope.addComment = function(_id, comment){
			var id = "";
			var comments = [];
			var data = {
				id   : _id,
				comment : comment
			};
			console.log("data in comment: " + data.comment);
			blogFactory.addComments(data).success(
				function(data, status, headers, config){
				console.log(status);
				}).error(function(){
					console.log("Error");
				});

		};
}]);


app.controller("bodymeasurementsController", ["$scope", "$location", function($scope, $location) {



}]);
app.controller("checkinController", ["$scope", "$location", function($scope, $location) {

}]);
app.controller("foodController", ["$scope", "$location", "$http", "foodFactory", function($scope, $location, $http, foodFactory) {
	$scope.foodItem = "Empty";
	$scope.recipeItem = "Empty";

	foodFactory.getFoodByName("SKYR").success(function(data, status, headers, config){
		if(status === 200) {
			console.log(data);
			$scope.foodItem = data;

		}
	}).error(function(){
		console.log("Error");
	});
}]);
app.controller("loginController", ["$scope", "$location", "$http", "userFactory",function($scope, $location, $http, userFactory){
	$scope.reg = {name: '', email: '', password:'', conpassword: ''};
	$scope.errorMsg = "";
	$scope.email = "";
	$scope.pass = "";

	$scope.connect = function(){
		if(!($scope.email || $scope.pass))
			return;

		userFactory.validUser($scope.email, $scope.pass).success(function(data, status, headers, config){
			if(status === 200) {
				if(data === 'Failed to authenticate') {
					$scope.errorMsg = data;
				} else if(data === 'Successfully authenticated') {
					$location.path("/");
				}
			}

			$scope.email = "";
			$scope.pass = "";
		}).error(function(){
			$scope.errorMsg = "Failed to authenticate";
			$scope.email = "";
			$scope.pass = "";
		});
	};

	$scope.register = function(){
		if(!$scope.reg)
			return;

		userFactory.setUser($scope.reg).success(function(data, status, headers, config){
			if (status === 200) {
				$location.path("/");
			}
		}).error(function(){
			console.log("Error");
		});

	};
}]);

app.controller("measurementsController", ["$scope", "$location", function($scope, $location) {

}]);
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

app.controller("metabolicController", ["$scope", "$location", function($scope, $location) {

}]);
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
app.controller("addCtrl", ["$scope", "$location", "foodFactory", function($scope, $location, foodFactory) {
	$scope.ingredients = [];
	$scope.foods = {};
	$scope.name = "";

	$scope.addIngredient = function() {
		if($scope.name === "" || $scope.amount === "" || $scope.type === "")
			return;

		$scope.ingredients.push({
			name: $scope.name,
			amount: $scope.amount,
			type: $scope.type
		});

		$scope.name = "";
		$scope.amount = "";  
		$scope.type = "";
	};

	$scope.removeIngredient = function(index) {
		$scope.ingredients.splice(index, 1);
	};

	$scope.updateTypeHead = function() {
		//Handels Empty string
		if($scope.name === "") {
			$scope.foods = {};
			return;
		}

		foodFactory.getFoodByName($scope.name).success(function(data, status, headers, config){
			if(status === 200) {
				$scope.foods = data;
			}
		}).error(function(){
			console.log("Error");
		});
	};
}]);
	app.controller("profileController", ["$scope", "$location", "$http", "profileFactory", "userFactory", 
	function($scope, $location, $http, profileFactory, userFactory) {
		console.log("in controller");

	$scope.profile = {
		user : "",
		firstName : "",
		lastName : "",
		email : "",
		height : "",
		weight : "",
		birthday : ""
	};

	$scope.posts = "";
	$scope.timeline = "";


	$scope.post = function(){
		var data = $scope.timeline;
		console.log(data);
		profileFactory.pushPost(data).success(function(data,status, headers,config){
			console.log(status);

		}).error(function(){
				console.log("error posting");
			});
	};



	profileFactory.getProfile().then(function(respond) {
		if(respond[0].status == 200 && respond[1].status == 200) {
			$scope.profile = respond[0].data;
			$scope.posts = respond[1].data;
			console.log($scope.posts);
		} else {
			$location.path("/login");
		}
	});

	$scope.changeInfo = function(){
		var data = $scope.profile;
		console.log(data.firstName);

		profileFactory.changeProfile(data).success(function(data, status,headers,config){
			console.log(status);
			$location.path("/");
		}).error(function(){
			console.log("Error");
		});
	};

	// Put user as a trainer
	$scope.trainer = function(){
		profileFactory.ImTrainer().then(function(){
			console.log("controller trainer");
		});
			
		 
	};


		$scope.favsCounter = function(_id){
			var id = "";
			var data = {
				id   : _id,
			};
			console.log("data in favsCount: " + data);
			profileFactory.addFavs(data).success(
				function(data, status, headers, config){
				console.log(status);
				}).error(function(){
					console.log("Error");
				});

		};

		$scope.addComment = function(_id, comment){
			var id = "";
			var comments = [];
			var data = {
				id   : _id,
				comment : comment
			};
			console.log("data in comment: " + data.comment);
			profileFactory.addComments(data).success(
				function(data, status, headers, config){
				console.log(status);
				}).error(function(){
					console.log("Error");
				});

		};
}]);





app.controller("addController", ["$scope", "$location", "foodFactory", function($scope, $location, foodFactory) {
	$scope.recipe = {
		title : "",
		steps : [],
		ingredients : [],
		tags : []
	};

	$scope.addIngredient = function(){
		$scope.recipe.ingredients.push();
	};

	$scope.addRecipe = function(){
		if($scope.recipe.title !== ""){
			foodFactory.postRecipe(recipe).success(function(data, status, headers) {
				console.log(status);
			});
		}
	};
}]);
app.controller("browseController", ["$scope", "$location", "foodFactory", function($scope, $location, foodFactory) {
	$scope.selected = undefined;
	
	$scope.$item = undefined;
	$scope.$model = undefined;
	$scope.$label = undefined;

	$scope.option = {A:10, B:15, C:20, D:[5.5, 30]};
	$scope.optionD = {min: 200, max: 700};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.updateTypeHead();
	};

	$scope.getName = function(name) {
		var names = name.split(", ");

		return $scope.toTitle(names[0]);
	};

	$scope.getSubName = function(name) {
		if(name.indexOf(", ") <= -1)
			return "";

		var names = name.split(", ");
		var subTitle = names[1];

		for (var i = 2; i < names.length; i++) {
			subTitle += '/' + names[i];
		}

		return $scope.toTitle(subTitle);
	};

	$scope.toTitle = function(name) {
		return (name.toLowerCase()).charAt(0).toUpperCase() + name.slice(1);
	};

	$scope.getType = function(type) {
		var num = parseInt(type, 10);

		if(isNaN(num))
			$scope.getTypeByName(type);

		if(num < 4)						//Blue
			return 'block-blue';

		if(num === 4 || num === 5)		//Yellow
			return 'block-yellow';

		if(num === 6 || num === 7)		//Green
			return 'block-green';

		if(num === 8 || num === 9)		//Red
			return 'block-red';

		if(num > 10 && num < 13)		//White
			return 'block-white';

		if(num === 16 || num === 13)	//Orange
			return 'block-orange';

		if(num === 14)					//Light Blue
			return 'block-lightBlue';

		if(num === 15)					//Gray
			return 'block-gray';

		if(num === 17)					//Red/Brown
			return 'block-redBrown';

		if(num === 18)					//Pink
			return 'block-pink';

		if(num === 19)					//Brown
			return 'block-brown';

		return 'block-defult';
	};

	$scope.getTypeByName = function(type) {
		console.log(type);
	};

	$scope.checkName = function(value) {
		if(value !== undefined && value !== null)
			return value;
		console.log("this: value returned in checkName:");
		console.log(value);
		return '-';
	};

	$scope.updateTypeHead = function() {
		//Handels Empty string
		if($scope.selected === "") {
			$scope.food = {};
			return;
		}



		foodFactory.getFoodByName($scope.selected).success(function(data, status, headers, config){
			if(status === 200) {
				$scope.food = data;
			}
		}).error(function(){
			console.log("Error");
		});
	};

	$scope.showRecipe = function(id) {
		foodFactory.getRecipeById(id).success(function(data, status, headers, config){
			if (status === 200) {
				$scope.recipeItem = data;
				console.log(id);
				console.log(data);
				//$location.path('/login');
			}
		}).error(function() {
			console.log("Error");
		});
	};
}]);
app.controller("skinfoldController", ["$scope", "$location", function($scope, $location) {



}]);
app.controller("statisticController", ["$scope", "$location", function($scope, $location) {
    $scope.dataStorage = {
        data1: [[3,7,9,1,4,6,8,2,5]],
        data2: [[8,7,2,1,3,4,6,8,5]],
        data3: [[9,8,7,6,5,4,3,2,1]],
        data4: [[3,7,9,1,4,6,8,2,5]],
        data5: [[8,8,8,8,0,8,8,8,8]],
        data6: [[9,0,9,0,9,0,9,0,9]]
    };

    $scope.plots = {
        data1: null,
        data2: null,
        data3: null,
        data4: null,
        data5: null,
        data6: null,
    };

    $scope.options = {
        title: 'This',
        grid: {
            background: 'rgb(245, 245, 245)'
        }
    };

    $scope.repaint = function(plotClass) {
        var plots = $('.' + plotClass), data, plot;

        //Wait 10ms before reploting
        setTimeout(function (){
            $(plots).each(function() {
                data = $(this).attr('ui-chart').split('.')[1];

                if($scope.plots[data] === null) {
                    $scope.plots[data] = $.jqplot(this.id, $scope.dataStorage[data], $scope.options);
                }

                if($scope.plots[data]._drawCount === 0)
                    plot.replot();

            });
        }, 10);
    };

    $scope.destroy = function(plotClass) {
        var plots = $('.' + plotClass), data, plot;

        $(plots).each(function() {
            data = $(this).attr('ui-chart').split('.')[1];
            plot = $.jqplot(this.id, $scope.dataStorage[data]);
            plot.destroy();
        });
    };

    angular.element(document).ready(function () {
        setTimeout(function() { 
            $scope.destroy('plotNutrients');
            $scope.repaint('plotNutrients');
        }, 1000);
    });
}]);
app.controller("trainersController", ["$scope", "$location", "trainersFactory", 
	function($scope, $location, trainersFactory) {

		$scope.trainers = "";


		trainersFactory.getTrainers().success(function(data, status, headers, config) {
			if(status === 200){
				$scope.trainers = data;
			}
		});
	}]);

angular.module('ui.calendar', [])
  .constant('uiCalendarConfig', {})
  .controller('uiCalendarCtrl', ['$scope', '$timeout', function($scope, $timeout){

      var sourceSerialId = 1,
          eventSerialId = 1,
          sources = $scope.eventSources,
          extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop,

          wrapFunctionWithScopeApply = function(functionToWrap){
              var wrapper;

              if (functionToWrap){
                  wrapper = function(){
                      // This happens outside of angular context so we need to wrap it in a timeout which has an implied apply.
                      // In this way the function will be safely executed on the next digest.

                      var args = arguments;
                      $timeout(function(){
                          functionToWrap.apply(this, args);
                      });
                  };
              }

              return wrapper;
          };

      this.eventsFingerprint = function(e) {
        if (!e.__uiCalId) {
          e.__uiCalId = eventSerialId++;
        }
        // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
        return "" + e.__uiCalId + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
          (e.allDay || '') + (e.className || '') + extraEventSignature(e) || '';
      };

      this.sourcesFingerprint = function(source) {
          return source.__id || (source.__id = sourceSerialId++);
      };

      this.allEvents = function() {
        // return sources.flatten(); but we don't have flatten
        var arraySources = [];
        for (var i = 0, srcLen = sources.length; i < srcLen; i++) {
          var source = sources[i];
          if (angular.isArray(source)) {
            // event source as array
            arraySources.push(source);
          } else if(angular.isObject(source) && angular.isArray(source.events)){
            // event source as object, ie extended form
            var extEvent = {};
            for(var key in source){
              if(key !== '_uiCalId' && key !== 'events'){
                 extEvent[key] = source[key];
              }
            }
            for(var eI = 0;eI < source.events.length;eI++){
              angular.extend(source.events[eI],extEvent);
            }
            arraySources.push(source.events);
          }
        }

        return Array.prototype.concat.apply([], arraySources);
      };

      // Track changes in array by assigning id tokens to each element and watching the scope for changes in those tokens
      // arguments:
      //  arraySource array of function that returns array of objects to watch
      //  tokenFn function(object) that returns the token for a given object
      this.changeWatcher = function(arraySource, tokenFn) {
        var self;
        var getTokens = function() {
          var array = angular.isFunction(arraySource) ? arraySource() : arraySource;
          var result = [], token, el;
          for (var i = 0, n = array.length; i < n; i++) {
            el = array[i];
            token = tokenFn(el);
            map[token] = el;
            result.push(token);
          }
          return result;
        };
        // returns elements in that are in a but not in b
        // subtractAsSets([4, 5, 6], [4, 5, 7]) => [6]
        var subtractAsSets = function(a, b) {
          var result = [], inB = {}, i, n;
          for (i = 0, n = b.length; i < n; i++) {
            inB[b[i]] = true;
          }
          for (i = 0, n = a.length; i < n; i++) {
            if (!inB[a[i]]) {
              result.push(a[i]);
            }
          }
          return result;
        };

        // Map objects to tokens and vice-versa
        var map = {};

        var applyChanges = function(newTokens, oldTokens) {
          var i, n, el, token;
          var replacedTokens = {};
          var removedTokens = subtractAsSets(oldTokens, newTokens);
          for (i = 0, n = removedTokens.length; i < n; i++) {
            var removedToken = removedTokens[i];
            el = map[removedToken];
            delete map[removedToken];
            var newToken = tokenFn(el);
            // if the element wasn't removed but simply got a new token, its old token will be different from the current one
            if (newToken === removedToken) {
              self.onRemoved(el);
            } else {
              replacedTokens[newToken] = removedToken;
              self.onChanged(el);
            }
          }

          var addedTokens = subtractAsSets(newTokens, oldTokens);
          for (i = 0, n = addedTokens.length; i < n; i++) {
            token = addedTokens[i];
            el = map[token];
            if (!replacedTokens[token]) {
              self.onAdded(el);
            }
          }
        };
        self = {
          subscribe: function(scope, onChanged) {
            scope.$watch(getTokens, function(newTokens, oldTokens) {
              if (!onChanged || onChanged(newTokens, oldTokens) !== false) {
                applyChanges(newTokens, oldTokens);
              }
            }, true);
          },
          onAdded: angular.noop,
          onChanged: angular.noop,
          onRemoved: angular.noop
        };

        return self;
      };

      this.getFullCalendarConfig = function(calendarSettings, uiCalendarConfig){
          var config = {};

          angular.extend(config, uiCalendarConfig);
          angular.extend(config, calendarSettings);
         
          angular.forEach(config, function(value,key){
            if (typeof value === 'function'){
              config[key] = wrapFunctionWithScopeApply(config[key]);
            }
          });

          return config;
      };
  }])
  .directive('uiCalendar', ['uiCalendarConfig', '$locale', function(uiCalendarConfig, $locale) {
    // Configure to use locale names by default
    var tValues = function(data) {
      // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
      var r, k;
      r = [];
      for (k in data) {
        r[k] = data[k];
      }
      return r;
    };
    var dtf = $locale.DATETIME_FORMATS;
    uiCalendarConfig = angular.extend({
      monthNames: tValues(dtf.MONTH),
      monthNamesShort: tValues(dtf.SHORTMONTH),
      dayNames: tValues(dtf.DAY),
      dayNamesShort: tValues(dtf.SHORTDAY)
    }, uiCalendarConfig || {});

    return {
      restrict: 'A',
      scope: {eventSources:'=ngModel',calendarWatchEvent: '&'},
      controller: 'uiCalendarCtrl',
      link: function(scope, elm, attrs, controller) {

        var sources = scope.eventSources,
            sourcesChanged = false,
            eventSourcesWatcher = controller.changeWatcher(sources, controller.sourcesFingerprint),
            eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventsFingerprint),
            options = null;

        function getOptions(){
          var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {},
              fullCalendarConfig;

          fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);

          options = { eventSources: sources };
          angular.extend(options, fullCalendarConfig);

          var options2 = {};
          for(var o in options){
            if(o !== 'eventSources'){
              options2[o] = options[o];
            }
          }
          return JSON.stringify(options2);
        }

        scope.destroy = function(){
          if(attrs.calendar) {
            scope.calendar = scope.$parent[attrs.calendar] =  elm.html('');
          } else {
            scope.calendar = elm.html('');
          }
        };

        scope.init = function(){
          scope.calendar.fullCalendar(options);
        };

        eventSourcesWatcher.onAdded = function(source) {
          scope.calendar.fullCalendar('addEventSource', source);
          sourcesChanged = true;
        };

        eventSourcesWatcher.onRemoved = function(source) {
          scope.calendar.fullCalendar('removeEventSource', source);
          sourcesChanged = true;
        };

        eventsWatcher.onAdded = function(event) {
          scope.calendar.fullCalendar('renderEvent', event);
        };

        eventsWatcher.onRemoved = function(event) {
          scope.calendar.fullCalendar('removeEvents', function(e) { return e === event; });
        };

        eventsWatcher.onChanged = function(event) {
          scope.calendar.fullCalendar('updateEvent', event);
        };

        eventSourcesWatcher.subscribe(scope);
        eventsWatcher.subscribe(scope, function(newTokens, oldTokens) {
          if (sourcesChanged === true) {
            sourcesChanged = false;
            // prevent incremental updates in this case
            return false;
          }
        });

        scope.$watch(getOptions, function(newO,oldO){
            scope.destroy();
            scope.init();
        });
      }
    };
}]);
app.directive('checker', ['$compile', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var button, checkbox, color, settings, state;

			function updateDisplay() {
				var isChecked = checkbox.is(':checked');

				// Set the button's state
				state = ((isChecked) ? "on" : "off");

				// Set the button's icon
				button.find('.state-icon').removeClass().addClass('state-icon ' + settings[state]);

				// Update the button's color
				if (isChecked) {
					button.removeClass('btn-default').addClass('btn-' + color + ' active');
				} else {
					button.removeClass('btn-' + color + ' active').addClass('btn-default');
				}
			}

			function setup(that) {
				button = that.find('button');
				checkbox = that.find('input:checkbox');
				color = button.data('color');
				settings = { on: 'glyphicon glyphicon-check', off: 'glyphicon glyphicon-unchecked' };
			}

			// Initialization
			function init() {
				updateDisplay();

				if (button.find('.state-icon').length === 0) {
					button.prepend('<i class="state-icon ' + settings[state] + '"></i> ');
				}
			}


			setup(elem);

			// Event Handlers
			button.on('click', function () {
				checkbox.prop('checked', !checkbox.is(':checked'));
				checkbox.triggerHandler('change');
				updateDisplay();
			});

			checkbox.on('change', function () {
				updateDisplay();
			});



			init();
		}
	};
}]);
app.directive('timeLine', ['$compile', function($compile) {
	var tempText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit.";
	var timeoutId;


	function getTemplate(dObj) {
		var tmp = "<p id='timer'>"+ dObj.hour + ":"+ checkTime(dObj.minute) +":" + checkTime(dObj.secounds) +"</p><ul id='timeline'>", type;
		var types = ['workout', 'eat', 'alarm'];

		for(var i = 0; i < 24; i++) {
			type = types[Math.floor((Math.random() * 2))];

			tmp += "<li class ='"+ type +" '>";
				tmp += "<input class='checkradio' id='work"+i+"' name='works' type='radio' checked=''>";
				tmp += getRelative(i);
				tmp += getContent(tempText);
			tmp += "</li>";
		}

		tmp += "</ul>";

		return tmp;
	}

	function getHour(hour) {
		hour = ((hour < 0)?hour + 24:hour);
		hour = ((hour >= 24)?hour - 24:hour);

		return (hour > 9)?hour+':00':'0'+hour+':00';
	}


	function getMinute(hour, minute) {
		hour = ((hour < 0)?hour + 24:hour);
		hour = ((hour >= 24)?hour - 24:hour);
		hour = (hour > 9)?hour+':':'0'+hour+':';

		return (minute > 9)?hour+minute:hour+minute+'0';
	}

	function checkTime(i) {
		return ((i < 10)?"0" + i:i);
	}

	function getRelative(id) {
		var str = "";

		str += "<div class='relative'>";
			str += "<label for='work"+id+"'>Lorem ipsum</label>";
			str += "<span class='circle'></span>";
		str += "</div>";

		return str;
	}

	function getContent(text) {
		var str = "";

		str += "<div class='content'>";
			str += "<p>";
			str += text;
			str += "</p>";
		str += "</div>";

		return str;
	}

	function updateLater(elem) {
		var d, h, m, s;

        timeoutId = setInterval(function() {
			d = new Date();
			h = d.getHours(); 
			m = checkTime(d.getMinutes());
			s = checkTime(d.getSeconds());

			elem.firstChild.innerHTML = h+":"+m+":"+s;
        }, 1000);
	}
        

	return {
		restrict: 'E',
		replace: 'true',
		link: function(scope, elem, attrs) {
			var d = new Date(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(); 

			elem.html(getTemplate({hour: h, minute:m, secounds: s, period:(h > 12)?'PM':'AM'}));
			$compile(elem.contents());

			elem.bind('$destroy', function() {
				clearInterval(timeoutId);
			});

			updateLater(elem[0]);
		}
	};
}]);
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
app.factory("profileFactory", ["$location", "$http", "$q", 
	function($location, $http, $q){
		var data;

		return { 
			addFavs: function(data){
				console.log("id: " + data.id);	
				return $http.put("http://localhost:3000/api/blog/meta/favs",
				{_id : data.id});
			},
			addComments: function(data){
				console.log("dataFactory: " + data.comment);	
				return $http.put("http://localhost:3000/api/blog/comment",
				{	_id		:data.id, 
					comment	:data.comment
				});
			},
			getProfile: function(){
				return $q.all([
					$http.get('http://localhost:3000/api/profile'),
						$http.get("http://localhost:3000/api/blog")
				]);
			},
			changeProfile: function(data){
				//console.log("change profile factory: " + data.firstName);
				return $http.put("http://localhost:3000/api/profile/update",
					{
						firstName	: data.firstName,
						lastName	: data.lastName,
						height		: data.height,
						weight		: data.weight,
						email		: data.email,
						birthday	: data.birthday
					});

			},
			pushPost: function(data){
				return $http.post("http://localhost:3000/api/blog", 
					{	title	:data.title, 
						body	:data.body, 
						tags	:data.tags
					});
			},

			ImTrainer: function(){
				return $http.put("http://localhost:3000/api/settrainer");
			}
			
		};
	}]);
app.factory("trainersFactory", ["$location", "$http", "$q", 
	function($location, $http, $q){
		return{
			
			getTrainers: function(data){
				return $http.get("http://localhost:3000/api/trainers");
			}
		};
	}]);
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

