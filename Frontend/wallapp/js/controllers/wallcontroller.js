var wallApp = angular.module('wallApp');

wallApp.controller('wallController', ['restApi', 'AuthFact', 'SweetAlert', '$timeout', '$interval', 'Socket', function(restApi, AuthFact, SweetAlert, $timeout, $interval, Socket){
	//Var initialization
	var wall = this;
	wall.wText = "";
	wall.posts = [];
	wall.msgnotifs = [];
	var uid;

	//Listener for new wall messages
	Socket.on('message', function(cb){
		//If a different user posted a message, or if there's no currently logged in user, show the notification
		if(wall.display_name!==cb.who || !wall.isLoggedIn){
			wall.msgnotifs.push(cb);
			if(wall.msgnotifs.length>1){
				wall.newPostNotif = "There are "+wall.msgnotifs.length +" new posts! Click here to load them.";
			}else if(wall.msgnotifs.length<=1){
				wall.newPostNotif = "There is "+wall.msgnotifs.length +" new post! Click here to load it.";
			}
			
		}
	});

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
	//Message posting function
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
					wall.getMessages();
				}, 1500);
			}).catch(function(){
				SweetAlert.swal("There was an error connecting to the server", "", "warning");
			})
		}
	};
	//Message obtaining function
	wall.getMessages = function(){
		restApi.FindMessages().then(function(datamsg){
			if(datamsg.data.data.length==0){
				wall.noMsgs = "There's nothing here (yet)!";
			}else{
				wall.noMsgs = "";
				wall.posts = datamsg.data.data;
		      	for (var i = 0; i < wall.posts; i++) {
		        	wall.posts.push(wall.posts[i].data);
		      	}


				wall.msgnotifs = [];
			}
		});
	};

	wall.getMessages();

	//Infinite scrolling function
	// wall.loadMore = function(){
	// 	var last = wall.posts[wall.posts.length-1];//esto es un objeto right? un array de objetos, si
	// 	console.log(wall.posts, "post");
	// 	for(var i=1; i <=10; i++){//lol for normalito. 10 es el total de elementos xdd
	// 		wall.posts.push(last);//anyways, que pretendes en esta linea? sumarle los elementos de last, pero si esta mal, habra que quitarla
	// 	}
	// };
	

	//no entiendo tu logica, como carajos sabes cual es el ultimo elemento del rray, osea donde termino? utilizaba last para eso, pero no me salio :/
}])
//cuantos elementos tienes en el backend? ponlos en 12. ya, ponsles numeros para diferenciarlos. ya
//wall.loadMore es para el scrolling
//wall.getMessages es la que obtiene la data de la api
//wall.posts es el array donde esta la data q viene de la api
//mierda, no es eso XD
//creo que el problema lo estoy viendo. Ahora que me fijo, en el ejemplo de ellos el array solo tiene 8 elementos y si scrolleas hacia abajo hace mas o menos lo mismo que en la app exacto, ese no fue el mejor ejemplo a seguuir