var wallApp = angular.module('wallApp');

wallApp.controller('regController', ['$location','restApi', '$timeout','AuthFact', function($location, restApi, $timeout, AuthFact){

	var appvar = this;
	//User registration function
	appvar.regUser = function(userdata, valid){
		if(valid){
			appvar.loading = true;
			appvar.errMsg = '';
		    restApi.Register(appvar.userdata).then(function(response){
		        
				if(response.data.success){
					appvar.loading = false;
					appvar.succMsg = response.data.message;
					appvar.errMsg = '';
					
					$timeout(function() {
						$location.url('/login');
						appvar.userdata={};

					}, 10000);

				}else{
					appvar.loading = false;
					appvar.errMsg = response.data.message;
				}
		    });
		}else{
			appvar.loading = false;
			appvar.errMsg = "Please make sure to fill the registration form properly";
		}
	};
	//Display name availability checking function
	appvar.checkDispName = function(userdata){
		appvar.dispMsg = false;
		appvar.invalidDisp = false;
		AuthFact.checkDisplayName(appvar.userdata).then(function(data){
			if(data.data.success){
				appvar.invalidDisp = true;
				appvar.dispMsg = data.data.message;
			}else{
				appvar.invalidDisp = false;
				appvar.dispMsg = data.data.message;
			}
		});
	}
	//Email address availability checking function
	appvar.checkEmail = function(userdata){

		appvar.emailMsg = false;
		appvar.invalidEmail = false;


		AuthFact.checkEmail(appvar.userdata).then(function(data){
			if(data.data.success){
				appvar.invalidEmail = true;
				appvar.emailMsg = data.data.message;
			}else{
				appvar.invalidEmail = false;
				appvar.emailMsg = data.data.message;
			}
		});
	}	
}])