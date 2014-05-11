var bxs = require('./vars').nodeElemBoxes

var renderTypeConf = require('./render_typeCont')
var renderPlot = require('./render_plot')
var renderlinksConnects = require('./render_linksConnects')

var renderNodes = module.exports = function (data, sel) {

    var nodes = sel.selectAll('.node')
        .data(data)

    nodes.enter()
        .append(function(){
            return document.querySelector('#temp-node .node').cloneNode(true)
        })
    nodes.style({
            left: function(d,i){return d.x+'px'},
            top: function(d,i){return d.y+'px'}
        })
    nodes.select('.nameCont')
        .text(function(d,i){return d.name})
        .attr({title: function(d,i){return d.name}})
        .style(updateElemBox(bxs.nameCont))
        .on('click', function(d,i){ 
            console.log(JSON.stringify(d.seq))  
        })

    nodes.select('.typeCont')
        .style(updateElemBox(bxs.typeCont))
        .call(renderTypeConf)

    nodes
        .call(renderPlot)
        // .select('.plot')
        // .style(updateElemBox(bxs.plot))

    nodes.exit().remove()

    renderlinksConnects(_sel, data)

}

var updateElemBox = function updateElemBox(d) {
    return {
        left: d.x+'px',
        top: d.y+'px',
        width: d.w+'px',
        height: d.h+'px'
    }
}