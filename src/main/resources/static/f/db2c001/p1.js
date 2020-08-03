app.controller('AppCtrl', function($scope, $http, $timeout) {
	ctrl = this
	initApp($scope, $http, $timeout)
	initDataModel()
	ctrl.page_title = 'db2c001:'
	init_db2c001($http)
})

var init_db2c001 = function($http){
	ctrl.l2c = {}//local to central DB
	
	ctrl.l2c.insert = function(dmEl, c){
		var sql = sql_app.INSERT_doc(dmEl)
		console.log(dmEl, c, sql)
		write_element_remote_db1(dmEl.doc_id)
	}

	ctrl.l2c.update_string = function(dmEl){
		var data = {}
		data.sql = sql_app.UPDATE_string(dmEl.doc_id, dmEl.value_1_22)
		read_remote.http.post('/r/url_sql_read_remote_db1', data)
		.then(function(response){
			var rE = ctrl.eMapR[dmEl.doc_id]
			var v = response.data.list1[0].value
			rE.value_1_22 = v
		})
	}

	ctrl.select_tree_item2 = function(dmEl){
		ctrl.select_tree_item(dmEl)
		console.log(dmEl.doc_id)
		read_element_children_remote_db1(dmEl.doc_id)
	}
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

var write_element_remote_db1 = function(doc_id, then_fn){
	var data = {}
	var d = ctrl.eMap[doc_id]
	data.sql = sql_app.INSERT_doc(d)
	console.log(data.sql)
	read_remote.http.post('/r/url_sql_read_remote_db1', data)
	.then(function(response){
		console.log(response.data)
		if(then_fn) then_fn(response)
	})
}

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
	var o = ctrl.eMapR[doc_id]
	if(o){
		if(o.cnt_child>0 && (!o.children || o.children.length < o.cnt_child)){
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
				if(then_fn)
				then_fn(response)
			})
		}
	}
}

var read_remote = {}
function Read_remote($http){
	this.http = $http
}
