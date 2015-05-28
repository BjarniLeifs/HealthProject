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