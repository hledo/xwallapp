var wallApp = angular.module('wallApp');

wallApp.controller('wallController', ['restApi', 'AuthFact', 'SweetAlert', '$timeout', '$interval', function(restApi, AuthFact, SweetAlert, $timeout, $interval){

	var wall = this;

	wall.wText = "";

	wall.posts = [];

	var uid;

	//Checking if the user is logged in
	if(AuthFact.isLoggedIn()){
		wall.isLoggedIn = true;
		//Obtaining user information
		AuthFact.getUser().then(function(data){
			wall.display_name = data.data.display_name;
			var reqBody = {
				display_name:data.data.display_name
			};
			//Obtaining user ID
			AuthFact.getUserId(reqBody).then(function(dataid){
				uid = dataid.data.userId;
			});
		})
	}else{
		wall.isLoggedIn = false;
	}	

	wall.postMessage = function(){
		//Validating message input
		if(wall.wText==""){
			SweetAlert.swal("You must post a valid message", "", "warning");
		}else{

			//Creating message object
			var msgObj = {
				body: wall.wText,
				display_name: wall.display_name,
				userId: uid
			};
			restApi.SendMessage(msgObj).then(function(cb){
				wall.wText="";
				SweetAlert.swal(cb.data.message, "", "success");
				$timeout(function() {
					getMessages();
				}, 1500);
			});
		}
	};
	//Message obtaining function
	getMessages = function(){
		restApi.FindMessages().then(function(datamsg){
			if(datamsg.data.data.length==0){
				wall.noMsgs = "There's nothing here (yet)!";
			}else{
				wall.noMsgs = "";
				wall.posts = datamsg.data.data;
			}
		});
	};
	//Automated message checking every minute
	$interval( function(){ 
		getMessages(); 

	}, 60000);

	getMessages();
}])