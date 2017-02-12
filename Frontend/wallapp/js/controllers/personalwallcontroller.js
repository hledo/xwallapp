var wallApp = angular.module('wallApp');

wallApp.controller('myWallController', ['$location', 'restApi', 'AuthFact', 'SweetAlert', function($location, restApi, AuthFact, SweetAlert){

	var mywall = this;

	getMyMessages = function(){
		//Checking if the user is logged in
		if(AuthFact.isLoggedIn()){
			//Obtaining user information
			AuthFact.getUser().then(function(data){
				mywall.display_name = data.data.display_name;
				var reqBody = {
					display_name:data.data.display_name
				};
				//Obtaining user ID
				AuthFact.getUserId(reqBody).then(function(dataid){
					uid = dataid.data.userId;
					var msgReqBody = {
						userId:uid
					};
					restApi.FindMyMessages(msgReqBody).then(function(datamsg){
						if(datamsg.data.data.length==0){
							mywall.noMsgs = "There's nothing here (yet)!";
						}else{
							mywall.noMsgs = "";
							mywall.posts = datamsg.data.data;
						}
					});
				});
			})
		}else{
			SweetAlert.swal("You must be logged in to see this page", "", "warning");
			//User redirection in case they managed to bypass security
			$timeout(function() {
				$location.path('/');

			}, 1000);
		}
	};
	getMyMessages();

}])