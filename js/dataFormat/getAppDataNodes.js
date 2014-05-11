// getAppDataNodes

var bxs = require('./vars').nodeElemBoxes
var nodeSize = bxs.size


module.exports = function getAppDataNodes (appData) {

    var nodes = flattenNodes(appData[0])
    _.each(nodes, function(d,i){
        d.leafNodes = getLeafNodesLength(d)
        d.x = d.depth*nodeSize[0]
    })
    setRowsYPos(appData, 0)
    _.each(nodes, function(d,i){
        delete d.leafNodes
        delete d.depth
    })

    return nodes
}

// traverse the rows struc setting up the y pos using reduce
// it need the leafNodes variable
function setRowsYPos (rows, initY) {
    _.reduce(rows, function(acc,d,i){
        d.y = acc
        if (d.rows) setRowsYPos(d.rows, acc)
        return acc+(nodeSize[1]*d.leafNodes)
    }, initY)
}

// return an array of nodes and set their depth
function flattenNodes (firstNode) {
    firstNode.depth = 0
    var nodes = [firstNode]
    if (firstNode.rows) addRows(firstNode.rows, 0)    
    function addRows (rows, depth) {
        _.each(rows, function(d,i){
            d.depth = depth+1
            nodes.push(d)
            if (d.rows) addRows(d.rows, depth+1)
        })
    }
    return nodes
}

// count the number of leaf nodes from any node
function getLeafNodesLength (node) {
    var data = [node]
    if (_.any(data, function(d,i){return d.rows})) flattenRows(data)
    function flattenRows (_data){
        data = _(_data)
            .map(function(d,i){
                if (d.rows) return d.rows
                return d
            }).flatten().value()
        if (_.any(data, function(d,i){return d.rows})) flattenRows(data)
    }
    return data.length
}