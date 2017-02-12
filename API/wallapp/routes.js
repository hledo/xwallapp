var Message = require('./models/messages.js');
var User = require('./models/users.js');
var jwt = require('jsonwebtoken');
var secret = 'thewall';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(router){
	//Sendgrid credentials object for email sending
	var options = {
		auth:{
			api_user: 'ximplittest',
			api_key: '@Ximplit1'
		}
	}
	var client= nodemailer.createTransport(sgTransport(options));

	//Message getting route
	router.get('/messages', function(request, response){
		Message.find(function(error, msgs) {
			if(error){
				response.json({success:false, data:error});
			}else{
				response.json({success:true, data:msgs});
			}
	    	
	    });
	});

	//User registration route
	router.post('/users', function(request, response){
		var user = new User();
		user.first_name = request.body.first_name;
		user.last_name = request.body.last_name;
		user.display_name = request.body.display_name;
		user.email = request.body.email;
		user.password = request.body.password;
		user.temporaryToken = jwt.sign({email:user.email, display_name:user.display_name}, secret);
		//User object validation
		if(request.body.first_name==null||request.body.first_name==""||request.body.display_name==null||request.body.display_name==""||request.body.email==null||request.body.email==""||request.body.password==null||request.body.password==""){
			response.json({success: false, message:"Please ensure that all required fields are filled."})
		}else if(request.body.password.length<6){
			response.json({success:false, message:"Your password must have a minimum of 6 characters."});
		}else{
			user.save(function(err){
				if(err){
					response.json({success:false, message:"Email or display name already in use."});
				}else{
					//Activation email sending
					var email = {
						from: 'Wall Admin Team, hgatoledo@gmail.com',
						to: user.email,
						subject: 'Account activation',
						text: 'Hello '+user.first_name+', Thank you for registering at The Wall. In order to Log in and post any messages, please click on the activation link below: http://localhost/wallapp/#/activate/'+user.temporaryToken,
						html: 'Hello <b>'+user.first_name+'</b>, <br><br> Thank you for registering at The Wall. In order Log in and post any messages, please click on the activation link below:<br><br><a href="http://localhost/wallapp/#/activate/'+user.temporaryToken+'">http://localhost/wallapp/#/activate/</a>'
					};
					client.sendMail(email, function(err, info){
						if(err){
							console.log(err);
						}else{
							console.log('Message sent: '+ info);
						}
					});
					response.json({success:true, message:"Registration successful! Please check your email "+request.body.email +" for activation purposes. You'll be redirected to our login page in 10 seconds."});
				}
			});			
		}
	});

	//User login route
	router.post('/login', function(request, response){
		if(request.body.email==""||request.body.email==null || request.body.email==undefined||request.body.password==""||request.body.password==null || request.body.password==undefined){
			response.json({success:false,message:"These fields cannot be empty."});
		}else{

			User.findOne({email:request.body.email}).select('email password display_name active').exec(function(err,user){
				if(err){
					response.json({success:false,message:"There was an error logging in, please try again."});		
				}
				if(!user){
					response.json({success:false,message:"This email does not exist."});
				}else if(user){
					if(request.body.password){
						var correctPassword = user.checkPassword(request.body.password);
						if(!correctPassword){
							response.json({success:false,message:"Invalid login credentials."});
						}else if(!user.active){
							response.json({success:false,message:"This account needs to be activated first. Please check your email."});
						}else{
							var utoken = jwt.sign({email:user.email, display_name:user.display_name}, secret);
							response.json({success:true,message:"Log in successful! Redirecting to the wall!", token:utoken});
						}					
					}else{
						response.json({success:false,message:"Please provide a password."});
					}
				}
			});
		}
	});


	//Display name checking route
	router.post('/checkname', function(request, response){
		User.findOne({display_name:request.body.display_name}).select('display_name').exec(function(err,user){
			if(err) response.json({success:false,message:"There was an error verifying this display name, please try again."});

			if(user){
				response.json({success:false,message:"This display name is already taken."});
			}else{
				response.json({success:false,message:"This display name is available for use."});
			}
		});
	});

	//Email checking route
	router.post('/checkemail', function(request, response){
		User.findOne({email:request.body.email}).select('email').exec(function(err,user){
			if(err) response.json({success:false,message:"There was an error verifying this e-mail address name, please try again."});

			if(user){
				response.json({success:false,message:"This e-mail name is already taken."});
			}else{
				response.json({success:false,message:"This e-mail address is available for use."});
			}
		});
	});	


	//User activation route
	router.put('/activate/:token', function(request, response){
		User.findOne({temporaryToken:request.params.token}, function(err, user){
			if(err) throw err;
			var token = request.params.token;

				jwt.verify(token, secret, function(err, match){
					if(err){
						response.json({success:false,message:"Activation link expired."});
					}else if(!user){
						response.json({success:false,message:"Activation link expired."});

					}else{

						user.temporaryToken = false;
						user.active = true;

						user.save(function(err){
							if(err){
								console.log(err);
							}else{
								var email = {
									from: 'Wall Admin Team, hgatoledo@gmail.com',
									to: user.email,
									subject: 'Account activated!',
									text: 'Hello '+user.first_name+', Your account has been successfully activated!',
									html: 'Hello <b>'+user.first_name+'</b>, <br><br> Your account has been successfully activated!'
								};
								client.sendMail(email, function(err, info){
									if(err){
										console.log(error);
									}else{
										console.log('Message sent.');
									}
								});
							}
						})
						response.json({success:true,message:"Account successfully activated!"});
					}
				});
		});
	});

	//Password reset email route
	router.put('/resetpassword', function(request, response){
		User.findOne({email:request.body.email}).select('email display_name resettoken').exec(function(err, user){
			if(err) throw err;
			if(!user){
				response.json({success:false,message:"An account for this e-mail was not found. Please try again"});

			}else {
				user.resettoken = jwt.sign({email:user.email, display_name:user.display_name}, secret);
				user.save(function(err){
					if(err){
						response.json({success:false,message:err});
					}else{

						//Sending actual password reset email
						var email = {
							from: 'Wall Admin Team, hgatoledo@gmail.com',
							to: user.email,
							subject: 'Password reset request',
							text: 'Hello, You recently requested your password to be reset. Please click on the link below in order to reset your password. http://localhost/wallapp/#/reset/'+user.resettoken,
							html: 'Hello, <br><br> You recently requested your password to be reset. Please click on the link below in order to reset your password.<br><br><a href="http://localhost/wallapp/#/reset/'+user.resettoken+'">http://localhost/wallapp/#/reset/</a>'
						};
						client.sendMail(email, function(err, info){
							if(err){
								console.log(error);
							}else{
								console.log('Message sent.');
							}
						});
						response.json({success:true,message:"Please check your e-mail for a password reset link."});
					}
				});
			}
		});
	});

	//Password reset token validation route
	router.get('/resetpassword/:token', function(request, response){
		User.findOne({resettoken:request.params.token}).select().exec(function(err, user){
			if (err) throw err;
			var token = request.params.token;

			jwt.verify(token, secret, function(err, match){
				if(err){
					response.json({success:false,message:"This Password link has expired."});
				}else if(!user){
					response.json({success:false,message:"This Password link has expired."});
				}else{
					response.json({success:true, user:user});
				}
			});

		});
	});

	//Password changing route
	router.put('/savepass', function(request, response){
		User.findOne({email:request.body.email}).select().exec(function(err, user){
			if(err) throw err;
			if(request.body.password==null ||request.body.password==""){
				response.json({success:false, message:"Password not provided."});
			}else{
				user.password = request.body.password;
				user.resettoken = false;
				user.save(function(err){
					if(err) {
						response.json({success:false, message:err});
					}else{
						response.json({success:true, message:'You password has been successfully changed. Redirecting to Log In Page.'});
					}
				});
			}
		});
	});

	//Token using method (Anything below here will require authentication)
	router.use(function(request, response, next){
		var token = request.body.token || request.body.query || request.headers['x-access-token'];
		if(token){
			jwt.verify(token, secret, function(err, match){
				if(err){
					response.json({success:false,message:"Invalid token."});
				}else{
					request.match = match;
					next();
				}
			});
		}else{
			response.json({success:false,message:"A token is required"});
		}
	})

	//Message posting route
	router.post('/messages', function(request, response){

		var message = new Message();
		message.body = request.body.body;
		message.userId = request.body.userId;
		message.display_name = request.body.display_name;

		if(request.body.body==null || request.body.body=='' || request.body.userId==null || request.body.userId=='' || request.body.display_name==null || request.body.display_name==''){
			response.json({success:false,message:"There was an error posting this message."});
		}else{
			message.save(function(err){
				if(err){
					response.json({success:false,message:"There was an error posting this message."});
				}else{
					response.json({success:true,message:"Message posted!"});
				}
			});
		}
	});

	//User specific messages getting route
	router.post('/mymessages', function(request, response){
		Message.find({userId:request.body.userId},function(error, msgs) {
			if(error){
				response.json({success:false, data:error});
			}else{
				response.json({success:true, data:msgs});
			}
	    });
	});

	//User token validation route
	router.post('/userdata', function(request, response){
		response.send(request.match);
		
	});

	//User id getting method
	router.post('/userid', function(request, response){

		User.findOne({display_name:request.body.display_name}).select('_id').exec(function(err, user){
			if(err) throw err;
			if(request.body.display_name==null ||request.body.display_name==""){
				response.json({success:false, message:"Data not provided"});
			}else if (!user){
				response.json({success:false, message:"This user was not found."});
			}else{
				response.json({success:true, userId:user._id});
			}
		});
	})

	return router;
}