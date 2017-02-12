(function(){'use strict';
	var module = angular.module('authService', []);
	module.factory('AuthFact', ['$window','$timeout','$location', '$q', '$http', function($window, $timeout,$location, $q, $http){
		//Defining API URL
		var apiUrl = 'http://localhost:3000/api';
		var AuthFact = {};
		//User authentication methods start

		//Checking if a user is logged in
		AuthFact.isLoggedIn = function(){
			var isToken = $window.localStorage.getItem('token');
			if(isToken){
				return true;
			}else{
				return false;
			}
		}

		//Obtaining user information
		AuthFact.getUser = function(){
			var isToken = $window.localStorage.getItem('token');
			if(isToken){
				return $http.post(apiUrl+'/userdata')
			}else{
				$q.reject({message:"There is no token"});
			}
		}

		//Obtaining user ID
		AuthFact.getUserId = function(display_name){
			var isToken = $window.localStorage.getItem('token');

			if(isToken){
				return $http.post(apiUrl+'/userid', display_name)
			}else{
				$q.reject({message:"There is no token"});
			}
		}

		//Display name checking for registration method
		AuthFact.checkDisplayName = function(regData){
			return $http.post(apiUrl+'/checkname', regData);
		}

		//Email checking for registration method
		AuthFact.checkEmail = function(regData){
			return $http.post(apiUrl+'/checkemail', regData);
		}

		//Account activation method
		AuthFact.activateAccount = function(token){
			return $http.put(apiUrl+'/activate/'+token)
		}

		//Password sending method
		AuthFact.sendPassword = function(resetData){
			return $http.put(apiUrl+'/resetpassword/', resetData);
		}

		//Password reset initiation method
		AuthFact.resetPass = function(token){
			return $http.get(apiUrl+'/resetpassword/'+token);
		}

		//Password changing method
		AuthFact.savePass = function(userData){
			return $http.put(apiUrl+'/savepass', userData);
		}

		//User authentication methods end
		return AuthFact;
	}]);

	//Interceptor for sending tokens on $http requests
	module.factory('AuthInterceptors', ['$window','$timeout','$location', '$q', function($window, $timeout,$location, $q){
		var AuthIntFact = {};
		AuthIntFact.request = function(config){
			var isToken = $window.localStorage.getItem('token');
			if (isToken){
				//Configure token for $http request headers
				config.headers['x-access-token'] = isToken;
			}
			return config;
		};		
		return AuthIntFact;
	}]);
})();






