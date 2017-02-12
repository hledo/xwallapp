var wallApp = angular.module('wallApp');

wallApp.controller('passwordController', ['$http', '$location','$timeout','AuthFact', '$routeParams', function($http, $location, $timeout, AuthFact, $routeParams){

	var pass = this;

	pass.sendPassword = function(resetData, valid){
		pass.errorMsg = false;
		pass.loading = true;

		if(valid){
			AuthFact.sendPassword(pass.resetData).then(function(data){
				pass.loading=false;

				if(data.data.success){
					pass.successrMsg = data.data.message;
					pass.errorMsg = false;
					pass.resetData = '';
				}else{
					pass.errorMsg = data.data.message;
					pass.successrMsg = false;

				}

			});


		}else{
			pass.loading = false;
			pass.errorMsg = 'Please enter a valid e-mail address';
		}

	};


	
}])