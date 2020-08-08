app.controller('AppCtrl', class {
    constructor($scope, $http, $timeout) {
        console.log(123)
        ctrl = this
        initApp($scope, $http, $timeout)
        read2 = new Read2($http)
        ctrl.page_title = 'fc001:'

        initBuildHRJ()
        read_element_descendant(368815, (response) =>
            read_element_descendant(371903, (response) =>
                $timeout(() => createRightJSON({}, ctrl.eMap[371903], $timeout), 400)
            )
        )
        // 371905 371903
        read2.elReadDocRJ({doc_id:371903})
    }
})

createRightJSON = (rJ, data, $timeout) => {
    var key = extractKey(data)
    rJ[key] = data.value_1_22
    rJ.doc_id = data.doc_id
    console.log(rJ, data)
    angular.forEach(data.children, (d) => {
        var k2 = extractKey(d)
        console.log(k2, d, ctrl.eMap[d.reference].doctype, 11)
        if (37 == ctrl.eMap[d.reference].doctype) {
            rJ[k2] = []
            addListRJ(rJ, d, k2)
        }
        // createRightJSON(rJ, d)
    })
    $timeout(() =>
        ctrl.pfNiceStr = JSON.stringify({ 'PlanDefinition': rJ }, undefined, 2), 200)
}

initBuildHRJ = () => {
    exe_fn.buildHRJ = {}
    exe_fn.buildHRJ.ActivityDefinition = (d2) => {
        // [371927] instantiatesCanonical ActivityDefinition:368817 
        console.log(111)
        read2.sql1({
            fn: (response) => {
                var task_id = response.data.list[0].parent
                console.log(task_id)
            }, params: {
                sql: "SELECT * FROM doc WHERE reference=371927 AND reference2 = " + d2.doc_id
            }
        })
    }
    read2.elReadDocRJ = (params) => {
        console.log(params)
        if (!ctrl.rJ) ctrl.rJ = { iteration: 0 }
        if (!ctrl.rJ[params.doc_id]) ctrl.rJ[params.doc_id] = {}
        ctrl.rJ.iteration++
        console.log(ctrl.rJ.iteration, ctrl.rJ, params)
        if (ctrl.rJ.iteration > 3) {
            console.log(ctrl.rJ)
            return
        }
        read2.read_element({//data
            params: params
            , fnForEach: (o, response) => {
                console.log(o.doc_id)
                var data = ctrl.eMap[params.doc_id]
                var reference = data.reference
                console.log(data, ctrl.rJ, reference, data.value_1_22)
                if (o.cnt_child)
                    read2.elReadDocRJ({doc_id:o.doc_id, parent:o.doc_id
                        , sql:sql_app.SELECT_children_with_i18n()})
                read2.read_element({//metadata
                    params: { doc_id: reference }
                    , fnForEach: (response2) => {
                        var key = extractKey(data)
                        ctrl.rJ[params.doc_id][key] = data.value_1_22
                        ctrl.rJ[params.doc_id].doc_id = params.doc_id
                        console.log(key, ctrl.eMap[reference], ctrl.rJ[params.doc_id])
                    }
                })
            }
        })
    }
}

addListRJ = (rJ, data, key) => {
    angular.forEach(data.children, (d) => {
        var e = { doc_id: d.doc_id }
        rJ[key].push(e)
        angular.forEach(d.children, (d2) => {
            var k2 = extractKey(d2)
            if (!k2) {
                read_element(d2.reference, () => {
                    var k3 = extractKey(d2)
                    if (ctrl.eMap[d2.reference].parent == d2.reference2) {
                        var ne = e[d2.r2value] = {}
                        ne[k3] = d2.value_1_22
                        ne.doc_id = d2.doc_id
                        // console.log( 'PlanDefinition:', rJ)
                        if (exe_fn.buildHRJ && exe_fn.buildHRJ[d2.r2value]) {
                            exe_fn.buildHRJ[d2.r2value](d2)
                        }
                    }
                })
            }
            // createRightJSON(e, d2)
        })
    })
}

extractKey = (data) => {
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
