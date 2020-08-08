app.controller('AppCtrl', class {
    constructor($scope, $http, $timeout) {
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
        read2.elReadDocRJ({ doc_id: 371903, rJ: { iteration: 0 } })
        $timeout(() => {
            ctrl.rJStr = JSON.stringify({ 'PlanDefinition': ctrl.rJ }, undefined, 2)
        }, 400)
    }
})

createRightJSON = (rJ, data, $timeout) => {
    var key = extractKey(data)
    rJ[key] = data.value_1_22
    rJ.doc_id = data.doc_id
    angular.forEach(data.children, (d) => {
        var k2 = extractKey(d)
        if (37 == ctrl.eMap[d.reference].doctype) {
            rJ[k2] = []
            addListRJ(rJ, d, k2)
        }
        // createRightJSON(rJ, d)
    })
    // console.log(rJ, '-------------------------36')
    ctrl.rJ1 = rJ
    $timeout(() => {
        ctrl.pfNiceStr = JSON.stringify({ 'PlanDefinition': ctrl.rJ1 }, undefined, 2)
    }, 300)
}

initBuildHRJ = () => {
    exe_fn.buildHRJ = {}
    exe_fn.buildHRJ.ActivityDefinition = (d2) => {
        // [371927] instantiatesCanonical ActivityDefinition:368817 
        read2.sql1({
            fnThen: (response) => {
                var task_id = response.data.list[0].parent
                console.log(task_id)
            }, params: {
                sql: "SELECT * FROM doc WHERE reference=371927 AND reference2 = " + d2.doc_id
            }
        })
    }
    read2.elReadDocRJ = (params) => {
        if (!ctrl.rJ) ctrl.rJ = params.rJ
        console.log('params = ', params.doc_id, params.parent, ctrl.rJ)
        // if (!ctrl.rJ[params.doc_id]) ctrl.rJ[params.doc_id] = {}
        if (++ctrl.rJ.iteration > 4) {
            console.log('END::', ctrl.rJ.iteration)
            return
        }
        read2.read_element({ //data
            params: params
            , fnForEach: (o, response) => {// forEach data Object
                let fnForEach = () => {
                    let key = extractKey(o)
                    console.log(key, o
                        , Array.isArray(params.rJ), params.rJ)
                    // params.rJ[key + '_id'] = o.doc_id
                    let rJO
                    if (Array.isArray(params.rJ)) {
                        rJO = params.rJ.push({ doc_id: o.doc_id })
                    } else
                        if (ctrl.eMap[o.reference] && 37 == ctrl.eMap[o.reference].doctype) {
                            params.rJ[key] = rJO = []
                            // console.log(key, Array.isArray(params.rJ), params.rJ )
                        } else if (ctrl.rJ == params.rJ) {
                            params.rJ[key] = o.value_1_22
                        } else if (o.cnt_child) {
                            rJO = params.rJ[key] = {}
                        } else {
                            params.rJ[key] = o.value_1_22
                        }
                    // if (!ctrl.rJ[o.doc_id]) ctrl.rJ[o.doc_id] = {}
                    if (o.cnt_child) {
                        if (!rJO) rJO = params.rJ
                        read2.elReadDocRJ({//read children
                            doc_id: o.doc_id, parent: o.doc_id, rJ: rJO
                            , sql: sql_app.SELECT_children_with_i18n()
                        })
                    }
                    // read2.elCreateRJ()
                }
                if (o.reference) {
                    read2.read_element({//read metadata
                        params: { doc_id: o.reference }
                        , fnForEach: fnForEach
                    })
                } else {
                    fnForEach()
                }
            }
        })

        read2.elCreateRJ = () => {
            // console.log(321)
        }
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
