app.controller('AppCtrl', function ($scope, $http, $timeout) {
    ctrl = this
    initApp($scope, $http, $timeout)
    read2 = new Read2($http)
    read2.read_element({ params: { doc_id: 1 } })
    ctrl.page_title = 'fc001:'
    read_element_descendant(368815, function (response) {
        read_element_descendant(371903, function (response) {
            $timeout(function () {
                createRightJSON({}, ctrl.eMap[371903], $timeout)
            }, 400);
        })
    })
})

var createRightJSON = function (rJ, data, $timeout) {
    var key = extractKey(data)
    rJ[key] = data.value_1_22
    rJ.doc_id = data.doc_id
    console.log(rJ, data)
    angular.forEach(data.children, function (d) {
        var k2 = extractKey(d)
        console.log(k2, d, ctrl.eMap[d.reference].doctype, 11)
        if (37 == ctrl.eMap[d.reference].doctype) {
            rJ[k2] = []
            addListRJ(rJ, d, k2)
        }
        // createRightJSON(rJ, d)
    })
    $timeout(function () {
        ctrl.pfNiceStr = JSON.stringify({ 'PlanDefinition': rJ }, undefined, 2)
        // console.log('PlanDefinition:', rJ, data, ctrl.pfNiceStr)
    }, 200)
}

function addListRJ(rJ, data, key) {
    angular.forEach(data.children, function (d) {
        var e = { doc_id: d.doc_id }
        rJ[key].push(e)
        angular.forEach(d.children, function (d2) {
            var k2 = extractKey(d2)
            if (!k2) {
                read_element(d2.reference, function () {
                    var k3 = extractKey(d2)
                    if (ctrl.eMap[d2.reference].parent == d2.reference2) {
                        var ne = e[d2.r2value] = {}
                        ne[k3] = d2.value_1_22
                        ne.doc_id = d2.doc_id
                        // console.log( 'PlanDefinition:', rJ)
                        if('ActivityDefinition' == d2.r2value){
                            console.log(111)
                            read2.sql1({fn:function(response){
                                var parent = response.data.list[0].parent
                                console.log(parent)
                            },params:{
                                sql:"SELECT * FROM doc where reference=371927 and reference2 = " + d2.doc_id
                            }})
                        }
                    }
                })
            }
            // createRightJSON(e, d2)
        })
    })
}

function extractKey(data) {
    var key = data.r1value
    if (!key) {
        var eDataRef = ctrl.eMap[data.reference]
        if (eDataRef) {
            key = eDataRef.value_1_22
            if (!key) {
                var key = eDataRef.r1value
            }
        }
    }
    return key
}
