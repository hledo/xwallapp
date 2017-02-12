(function(){'use strict';
	var module = angular.module('restService', []);
	module.factory('restApi', ['$http','$window','$timeout','$location', '$q', function($http, $window, $timeout,$location, $q){
		//Defining API URL
		var apiUrl = 'http://localhost:3000/api';

		var restApi = {};

		//Message methods begin

		//Find all messages
		restApi.FindMessages = function(){
			return $http.get(apiUrl+'/messages');
		}

		//Find specific message
		restApi.FindMessageById = function(id){
			return $http.get(apiUrl+'/messages/'+id);
		}

		//Find User specific messages
		restApi.FindMyMessages = function(data){
			return $http.post(apiUrl+'/mymessages', data);
		}


		//Post a message
		restApi.SendMessage = function(data){
			var isToken = $window.localStorage.getItem('token');
			if(isToken){
				return $http.post(apiUrl+'/messages', data);
			}else{
				$q.reject({message:"There is no token"});
			}
		}

		//Edit/update a message
		restApi.UpdateMessage = function(id, data){
			return $http.put(apiUrl+'/messages/'+id, data);
		}	

		//Delete a message
		restApi.RemoveMessage = function(id){
			return $http.delete(apiUrl+'/messages/'+id);
		}	
		//Message methods end

		//User registration, login and logout methods begin
		restApi.Register = function(data){
			return $http.post(apiUrl+'/users', data);
		}

		restApi.Login = function(data){
			return $http.post(apiUrl+'/login', data).then(function(cb){
				var isToken = $window.localStorage.getItem('token');
				if(isToken){
					$window.localStorage.removeItem('token');
					$timeout(function() {
						$window.localStorage.setItem('token', cb.data.token);
					}, 1000);
				}else if(!isToken && cb.data.token!==undefined){
					$window.localStorage.setItem('token', cb.data.token);
				}
				return(cb);
			});
		}

		restApi.Logout = function(){
			var isToken = $window.localStorage.getItem('token');
			if(isToken){
				$window.localStorage.removeItem('token');
				$timeout(function() {
					$location.url('/logout');

					$timeout(function() {
						$location.path('/');
					}, 3000);
				}, 1000);
				
			}else{
				$location.path('/wall');
			}
		}
		//User registration, login and logout methods end
		return restApi;
	}]);

})();





