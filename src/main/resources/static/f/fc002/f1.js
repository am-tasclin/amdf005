app.controller('AppCtrl', function ($scope, $http, $timeout) {
    ctrl = this
    initApp($scope, $http, $timeout)
    read2 = new Read2($http)
    read2.read_element({ params: { doc_id: 1 } })
    ctrl.page_title = 'fc001:'
    read_element_descendant(368815, function (response) {
        read_element_descendant(371903, function (response) {
            $timeout(function () {
                createRightJSON({}, ctrl.eMap[371903])
            }, 400);
        })
    })
})

var createRightJSON = function (rJ, data) {
    var key = extractKey(data)
    rJ[key] = data.value_1_22
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
}

function addListRJ(rJ, data, key) {
    angular.forEach(data.children, function (d) {
        var e = { doc_id: d.doc_id }
        rJ[key].push(e)
        console.log(d.children, d.doc_id)
        angular.forEach(d.children, function (d2) {
            var k2 = extractKey(d2)
            console.log(d2.doc_id, k2)
            // createRightJSON(e, d2)
        })
    })
    console.log(rJ, data, key)
}

function extractKey(data) {
    var key = data.r1value
    if (!key) {
        key = ctrl.eMap[data.reference].value_1_22
        if (!key) {
            var key = ctrl.eMap[data.reference].r1value
        }
    }
    return key
}
