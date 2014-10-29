'use strict';

/* Directives */
function printDirective(){
	var printSection = document.getElementById('printSection');
	// if there is no printing section, create one
	if(!printSection){
		printSection = document.createElement('div');
		printSection.id = 'printSection';
		document.body.appendChild(printSection);
	}
	function link(scope, element, attrs) {
		element.on('click', function () {
			var elemToPrint = document.getElementById(attrs.printElementId);
			if (elemToPrint) {
				printElement(elemToPrint);
			}
		});
		window.onafterprint = function(){
			printsection.innerHTML = "";
		}
	}
	function printElement(elem) {
		var domClone = elem.cloneNode(true);
		printSection.appendChild(domClone);
		window.print();
	}
	return {
		link:link,
		restrict: 'A'
	};
}
angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('onlyNum', function(){
	  return function(scope, element, attrs){
		  var keyCode = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
		  element.bind("keydown", function(event) {
			  if($.inArray(event.which,keyCode) == -1) {
				  scope.$apply(function(){
					  scope.$eval(attrs.onlyNum);
					  event.preventDefault();
				  });
				  event.preventDefault();
			  }
		  });
	  }
  }).
  directive('ngPrint',[printDirective]);
