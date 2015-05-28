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