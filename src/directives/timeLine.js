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