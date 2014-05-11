//render linksConnects

var bxs = require('./vars').nodeElemBoxes

module.exports = function (sel, data) {

    var svg = sel.insert('div', '*')
        .classed('connectionsContainer', true)
        .append('svg')

    var line = d3.svg.line()
        .interpolate('step-before')
    var linksSData = []
    var linksSBefData = []
    _.each(data, function(node,i){
        if (node.type == 'array') {
            var f = _.first(node.rows)
            var l = _.last(node.rows)
            linksSBefData.push([
                [
                    f.x - bxs.space/2-2, 
                    f.y + bxs.nameCont.y+3
                ],
                [
                    f.x - bxs.space/2 - 6, 
                    f.y + bxs.nameCont.y+3
                ],
                [
                    f.x - bxs.space/2 - 6, 
                    l.y + bxs.nameCont.y + bxs.nameCont.h-3
                ],
                [
                    f.x - bxs.space/2-2, 
                    l.y + bxs.nameCont.y + bxs.nameCont.h-3
                ],
            ])
            linksSBefData.push([
                [
                    node.x + bxs.typeCont.x + bxs.typeCont.w, 
                    node.y + bxs.nameCont.y + bxs.nameCont.h/2
                ],
                [
                    node.x + bxs.typeCont.x + bxs.typeCont.w + 6, 
                    node.y + bxs.nameCont.y + bxs.nameCont.h/2
                ]
            ])
            _.each(node.rows, function(row,i){
                linksSBefData.push([
                    [
                        node.x + bxs.typeCont.x + bxs.typeCont.w + bxs.space/2 +4, 
                        node.y + bxs.nameCont.y + bxs.nameCont.h/2
                    ],
                    [
                        row.x, 
                        row.y + bxs.nameCont.y + bxs.nameCont.h/2
                    ]
                ])
            })
        } else {
            _.each(node.rows, function(row,i){
                linksSData.push([
                    [
                        node.x + bxs.typeCont.x + bxs.typeCont.w, 
                        node.y + bxs.nameCont.y + bxs.nameCont.h/2
                    ],
                    [
                        row.x, 
                        row.y + bxs.nameCont.y + bxs.nameCont.h/2
                    ]
                ])
            })
        }
        if (!node.rows) {
            linksSData.push([
                [
                    node.x + bxs.typeCont.x + bxs.typeCont.w, 
                    node.y + bxs.nameCont.y + bxs.nameCont.h/2
                ],
                [
                    node.x + bxs.plot.x, 
                    node.y + bxs.nameCont.y + bxs.nameCont.h/2
                ]
            ])
        }
    })
    line.interpolate('step-before')

    var linksSBef = svg //d3.select('.connectionsContainer svg')
        .selectAll('path.linkSBef').data(linksSBefData)
    linksSBef.enter().append('path')
        .classed('linkSBef', true)
    linksSBef.attr({
            d: line
        })
        .style({
            fill: 'none',
            stroke: 'black',
            'shape-rendering': 'crispEdges'
        })
    linksSBef.exit().remove()
    line.interpolate('step')

    sel
       .style({
           width: d3.max(data, function(d,i){return d.x})+585+'px',
           height: d3.max(data, function(d,i){return d.y})+85+'px'
       }) 
    var linksS = svg //d3.select('.connectionsContainer svg')
        .attr({
            width: d3.max(data, function(d,i){return d.x})+35,
            height: d3.max(data, function(d,i){return d.y})+45
        })
        .selectAll('path.linkS').data(linksSData)
    linksS.enter().append('path')
        .classed('linkS', true)
    linksS.attr({
            d: line
        })
        .style({
            fill: 'none',
            stroke: 'black',
            'shape-rendering': 'crispEdges'
        })
    linksS.exit().remove()
}