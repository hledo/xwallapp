var wallApp = angular.module('wallApp');

wallApp.controller('resetController', ['$location','$timeout','AuthFact', '$routeParams', '$scope', function($location, $timeout, AuthFact, $routeParams, $scope){
	var reset = this;
	AuthFact.resetPass($routeParams.token).then(function(data){
		if(data.data.success){
			reset.successMsg = "Please enter a new password";
			$scope.email = data.data.user.email;
			reset.disabled = false;
		}else{
			reset.errorMsg = data.data.message;
			reset.disabled = true;
		}
	});

	reset.savePass = function(userData, valid, confirmed){
		reset.errorMsg = false;
		reset.userData.email = $scope.email;
		reset.disabled = false;
		if(valid&&confirmed){
			AuthFact.savePass(reset.userData).then(function(data){
				if(data.data.success){
					reset.successMsg = data.data.message;
					reset.disabled = true;
					$timeout(function() {
						$location.path('/login');
					}, 5000);

				}else{
					reset.errorMsg = data.data.message;
					reset.disabled = false;
				}
			});
		}else{
			reset.successMsg = '';
			reset.errorMsg = "Please make sure that the form is filled properly."
			reset.disabled = false;
		}
	}
}])