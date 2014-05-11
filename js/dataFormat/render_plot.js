// renderPlot

var renderPlotNumber = require('./render_plotNumber')
var box = require('./vars').nodeElemBoxes.plot
var margin = require('./vars').margins.plot

module.exports = function (sel) {
    sel.each(each)
}

function each (data) {
    var sel = d3.select(this)

    if (!data.values) {
        sel.select('.plot').remove()
        return
    }

    if (sel.select('.plot').empty()) {
        sel.append(function () {
            return document.querySelector('#temp-plot .plot').cloneNode(true)
        })
    }

    sel = sel.select('.plot')
        .style({
            left: box.x+'px',
            top: box.y+'px',
            width: box.w+'px',
            height: box.h+'px'
        })

    var width = box.w - margin.l - margin.r,
        height = box.h - margin.t - margin.b

    sel.selectAll('svg, canvas')
        .attr({
            width: box.w+'px', height: box.h+'px'
        })
    sel.select('g.main')
        .attr({transform: 'translate('+margin.l+','+margin.t+')'})

    sel.select('rect.background')
        .attr({
            x: 0, y: 0,
            width: width, height: height
        })

    if (data.type == 'number') renderPlotNumber(data, sel)
    // if (data.type == 'aas') renderAas(data, sel)
}