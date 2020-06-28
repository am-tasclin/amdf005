app.controller('AppCtrl', function($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	initDataModel()
	ctrl.page_title = 'db2c001:'
	init_db2c001($http)
})


var read_element_remote_db1 = function(doc_id, then_fn){
	var sql = sql_app.SELECT_obj_with_i18n(doc_id)
	read_remote.http.get('/r/url_sql_read_remote_db1'
	, {params:{sql:sql}})
	.then(function(response){
		var d = response.data.list[0]
		ctrl.eMapR[d.doc_id] = d
		then_fn(response)
	})
}
var read_element_children_remote_db1 = function(doc_id, then_fn){
	var sql = sql_app.SELECT_children_with_i18n(doc_id)
	read_remote.http.get('/r/url_sql_read_remote_db1'
	, {params:{sql:sql}})
	.then(function(response){
		angular.forEach(response.data.list, function(d){
			ctrl.eMapR[d.doc_id] = d
			var parent = ctrl.eMapR[d.parent]
			if(parent){
				if(!parent.children){
					parent.children = []
				}
				parent.children.push(d)
			}
		})
		then_fn(response)
	})
}

var init_db2c001 = function($http){
	ctrl.eMapR = {}
	read_remote = new Read_remote($http)
	console.log('read -> ',111)
	if(ctrl.request.parameters.d2d){
		ctrl.d2d_ids = ctrl.request.parameters.d2d.split(',')
		var d2d_id = ctrl.d2d_ids[0]
		read_element(d2d_id, function(response, sql1){
			read_element_children(d2d_id, function(response, sql2){
				console.log(ctrl.eMap[d2d_id])
				read_element_remote_db1(d2d_id, function(request){
					console.log(request.data.list[0])
					read_element_children_remote_db1(d2d_id, function(request2){
						console.log(request2.data.list)
					})
				})
			})
		})
	}else{
		window.location.replace("?d2d=45")
	}
}

var read_remote = {}
function Read_remote($http){
	this.http = $http
}
