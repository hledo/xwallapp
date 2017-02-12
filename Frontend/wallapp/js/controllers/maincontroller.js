var wallApp = angular.module('wallApp');

wallApp.controller('mainController', ['$location', 'restApi','$timeout', 'AuthFact', '$rootScope', 'SweetAlert', function($location, restApi, $timeout, AuthFact, $rootScope, SweetAlert){
	var nav = this;

	$rootScope.$on('$routeChangeStart', function(){

		nav.authText = {
			login:"Log In",
			logout:"Log Out",
			register:"Register"
		}

		if(AuthFact.isLoggedIn()){
			nav.isLoggedIn = true;
			AuthFact.getUser().then(function(data){
				
				nav.display_name = "Hello "+data.data.display_name;
			})
		}else{
			nav.isLoggedIn = false;
			nav.display_name = '';
		}		

	});

	nav.logIn = function(userdata, valid){
		if(valid){
			nav.loading = true;
			nav.errMsg = false;
		    restApi.Login(nav.userdata).then(function(response){
				if(response.data.success){
					nav.loading = false;
					nav.succMsg = response.data.message;
					nav.errMsg = false;
					
					$timeout(function() {
						$location.url('/wall');
						nav.userdata='';
						nav.succMsg = false;
					}, 5000);
				}else{
					nav.loading = false;
					nav.errMsg = response.data.message;
				}
		    }); 
		}else{
			nav.loading = false;
			nav.errMsg = "Please make sure to fill the login form properly";
		}
	}

	nav.logOut = function(){
		SweetAlert.swal({
		   title: "Confirmation",
		   text: "Are you sure that you want to log out?",
		   type: "warning",
		   showCancelButton: true,
		   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes",
		   cancelButtonText: "No",
		   closeOnConfirm: true,
		   closeOnCancel: true }, 
		function(isConfirm){ 
		   if (isConfirm) {
		      restApi.Logout();
		   }
		});
	}
}])