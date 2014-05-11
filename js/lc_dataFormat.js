var constructAppData = require('./dataFormat/constructAppData')
var getAppDataNodes = require('./dataFormat/getAppDataNodes')
var renderNodes = require('./dataFormat/render_nodes')

module.exports = function (data, _opts) {

    // var data = func(jsonStringParse(originalStringData))

    // construct app data
    var appData = constructAppData([{data:data}])

    var nodes = getAppDataNodes(appData)

    // render vis structure
    var sel = _sel.append('div')
        .style({
            position: 'relative'
        })
    renderNodes(nodes, sel)

}