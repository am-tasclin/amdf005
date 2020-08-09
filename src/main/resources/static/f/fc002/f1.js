import('/f/fc002/f2i.js')
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
        ctrl.rJ = { iteration: 0 }
        read2.elReadDocRJ({ doc_id: ctrl.request.parameters.id, rJ: ctrl.rJ })
        $timeout(() => {
            // console.log(ctrl.rJ.doc_id, ctrl.eMap[ctrl.eMap[ctrl.rJ.doc_id].reference].parent, ctrl.eMap[ctrl.rJ.doc_id].reference2)
            let rootName = 'PlanDefinition'
            console.log(ctrl.rJ, ctrl.rJ.doc_id)
            if (ctrl.eMap[ctrl.rJ.doc_id].reference && ctrl.eMap[ctrl.eMap[ctrl.rJ.doc_id].reference].parent == ctrl.eMap[ctrl.rJ.doc_id].reference2) {
                rootName = ctrl.eMap[ctrl.rJ.doc_id].r2value
                console.log(ctrl.eMap[ctrl.rJ.doc_id].r2value)
            }
            let j = {}
            j[rootName] = ctrl.rJ
            ctrl.rJStr = JSON.stringify(j, undefined, 2)
        }, 1000)
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
        console.log('params = ', params.doc_id, params.parent)
        // if (!ctrl.rJ[params.doc_id]) ctrl.rJ[params.doc_id] = {}
        if (++ctrl.rJ.iteration > 14) {
            console.log('END::', ctrl.rJ.iteration)
            return
        }
        read2.read_element({ //data
            params: params
            , fnForEach: (o, response) => {// forEach data Object
                let readRefRef2 = (rJO) => {
                    // [371927] instantiatesCanonical ActivityDefinition:368817
                    if (368817 == o.reference2) {//ActivityDefinition
                        read2.sql1({
                            fnThen: (response) => {
                                angular.forEach(response.data.list, (d) => {
                                    rJO.Task = []
                                    read2.elReadDocRJ({ doc_id: d.parent, rJ: rJO.Task })
                                })
                            }, params: {
                                r: 371927, r2: o.doc_id,
                                sql: "SELECT * FROM doc WHERE reference=:r AND reference2 = :r2"
                            }
                        })
                    }
                }
                let addValue_1_22 = (rJ, key, o) => {
                    if (o.value_1_22 && key)
                        rJ[key] = o.value_1_22
                }
                let fnForEach = () => {
                    let key = extractKey(o)
                    let rJO
                    if (ctrl.eMap[o.parent] && 371968 == ctrl.eMap[o.parent].reference2) {//Element
                        params.rJ[o.r1value] = o.reference2
                    } else if (Array.isArray(params.rJ)) {//add object to list
                        if (!o.reference && o.reference2) {
                            rJO = {}
                            rJO[o.r2value] = { doc_id: o.doc_id }
                            params.rJ.push(rJO)
                            rJO = rJO[o.r2value]
                        } else {
                            rJO = { doc_id: o.doc_id }
                            params.rJ.push(rJO)
                        }
                    } else if (ctrl.eMap[o.reference] && 37 == ctrl.eMap[o.reference].doctype) {//create list
                        params.rJ[key] = rJO = []
                    } else if (ctrl.rJ == params.rJ) {
                        addValue_1_22(params.rJ, key, o)
                        params.rJ[key + '_id'] = o.doc_id
                        if (!params.rJ.doc_id) params.rJ.doc_id = o.doc_id
                    } else if (o.reference && ctrl.eMap[o.reference].parent == o.reference2) {//Definition root style as ActivityDefinition.name
                        rJO = params.rJ[o.r2value] = {}
                        addValue_1_22(rJO, key, o)
                        rJO.doc_id = o.doc_id
                        rJO[key + '_id'] = o.doc_id
                        readRefRef2(rJO)
                    } else if (o.cnt_child) {
                        rJO = params.rJ[key] = {}
                    } else {
                        addValue_1_22(params.rJ, key, o)
                        params.rJ[key + '_id'] = o.doc_id
                        params.rJ.doc_id = o.doc_id
                    }
                    // if (!ctrl.rJ[o.doc_id]) ctrl.rJ[o.doc_id] = {}
                    if (o.cnt_child) {
                        if (!rJO) rJO = params.rJ
                        read2.elReadDocRJ({//read children
                            doc_id: o.doc_id, parent: o.doc_id, rJ: rJO
                            , sql: sql_app.SELECT_children_with_i18n()
                        })
                    }
                }
                if (o.reference) {
                    read2.read_element({//read metadata
                        params: { doc_id: o.reference }
                        , fnForEach: fnForEach
                    })
                } else {
                    fnForEach(o)
                }
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
