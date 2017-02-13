(function(){'use strict';
	var module = angular.module('socketService', []);
	//Interceptor for sending tokens on $http requests
	module.factory('Socket', ['socketFactory', function(socketFactory){

		return socketFactory({
			prefix:'', 
			ioSocket:io.connect('http://localhost:3000/')
		});
	}]);

})();






