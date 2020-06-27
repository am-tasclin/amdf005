app.controller('AppCtrl', function($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	initDataModel()
	ctrl.page_title = 'db2c001:'
	init_db2c001()
})

var init_db2c001 = function(){
	console.log('read -> ',111)
	if(ctrl.request.parameters.d2d){
		ctrl.d2d_ids = ctrl.request.parameters.d2d.split(',')
		angular.forEach(ctrl.d2d_ids, function(v){
			console.log(v)
			read_element(v, function(){
				read_element_children(v, function(){
					console.log(ctrl.eMap[v])
				})
			})
		})
	}else{
		window.location.replace("?d2d=45")
	}
}