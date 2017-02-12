var wallApp = angular.module('wallApp');

wallApp.controller('emailController', ['$location','$timeout','AuthFact', '$routeParams', function($location, $timeout, AuthFact, $routeParams){
	var act = this;
	//Email activation function
	AuthFact.activateAccount($routeParams.token).then(function(data){
		act.actInfo = data.data.message+' Redirecting to the login page.';
		$timeout(function() {
			$location.path('/login');
		}, 5000);
	});
	
}])