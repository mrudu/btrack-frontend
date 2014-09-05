'use strict';

/* Filters */

angular.module('myApp.filters', []).
filter('interpolate', ['version', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	}
}]).
filter('indno', function(){
	return function(tel){
		if(!tel) {return '';}
		var x = tel.toString().trim().replace(/^\+/, '');
		if (x.match(/[^0-9]/)) {
			return tel;
		}
		var lastThree = x.substring(x.length-3);
		var otherNumbers = x.substring(0,x.length-3);
		if(otherNumbers != ''){
			lastThree = ',' + lastThree;
		}
		var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
		return res
	};
});
