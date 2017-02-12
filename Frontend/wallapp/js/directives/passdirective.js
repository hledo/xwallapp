//Password matching directive
wallApp.directive('passMatch', function(){
	return{
		restrict:'A',
		controller: function($scope){
			$scope.pConfirm = function(value){
				value.forEach(function(checkk){
					if($scope.confirm==checkk){
						$scope.confirmed=true;
					}else{
						$scope.confirmed=false;
					}
				});
			}
		},
		link: function(scope, element, attrs){
			attrs.$observe('passMatch', function(){
				scope.matches = JSON.parse(attrs.passMatch);
				scope.pConfirm(scope.matches);
			});
			scope.$watch('confirm', function(){
				scope.matches = JSON.parse(attrs.passMatch);
				scope.pConfirm(scope.matches);
			})
		}
	};

});