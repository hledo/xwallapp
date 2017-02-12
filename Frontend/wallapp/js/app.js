var wallApp = angular.module('wallApp',['ngRoute', 'restService','authService', 'ngAnimate', 'oitozero.ngSweetAlert']);

//Fixing url hash
wallApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

//Adding token interceptors for $http requests
wallApp.config(['$httpProvider', function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
}]);

wallApp.config(function($routeProvider, $locationProvider){
	$routeProvider.when('/',{
		controller:'wallController',
		templateUrl: 'views/main.html',
		controllerAs: 'wall'
	})
	.when('/wall',{
		controller:'wallController',
		templateUrl: 'views/main.html',
		controllerAs: 'wall'
	})

	.when('/myposts',{
		controller:'myWallController',
		templateUrl: 'views/myposts.html',
		controllerAs: 'mywall',
		authenticated:true
	})	

	.when('/login',{
		controller:'mainController',
		templateUrl:'views/login.html',
		authenticated:false
	})

	.when('/logout',{
		templateUrl:'views/logout.html',
		authenticated:true
	})	

	.when('/register',{
		controller:'regController',
		controllerAs: 'register',
		templateUrl:'views/register.html',
		authenticated:false
	})

	.when('/activate/:token',{
		controller:'emailController',
		controllerAs: 'email',
		templateUrl:'views/activate.html',
		authenticated:false
	})

	.when('/passwordrecovery',{
		controller:'passwordController',
		controllerAs: 'pass',
		templateUrl:'views/passreset.html',
		authenticated:false
	})

	.when('/reset/:token',{
		controller:'resetController',
		controllerAs: 'reset',
		templateUrl:'views/newpassword.html',
		authenticated:false
	})

	.otherwise({
		redirectTo:'/'
	});

});

wallApp.run(['$rootScope', 'AuthFact', '$location', '$timeout', function($rootScope, AuthFact, $location, $timeout){


	//Checking for authentication before allowing access to certain routes
	$rootScope.$on('$routeChangeStart', function(event, next, current){

		if(next.$$route.authenticated==true){
			if(!AuthFact.isLoggedIn() && $location.path()!=="/logout"){
				event.preventDefault();
				$location.path('/')
			}

		}else if(next.$$route.authenticated==false){
			if(AuthFact.isLoggedIn()){
				event.preventDefault();
				$location.path('/profile')
			}
		}

	});	

	//Fixing Angular's autofocus issue with ngRoute
	$rootScope.$on('$routeChangeSuccess', function() {

		$timeout(function(){
		  $('[autofocus]').focus();
		});
	});

}]);


