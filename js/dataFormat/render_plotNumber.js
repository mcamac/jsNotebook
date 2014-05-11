var box = require('./vars').nodeElemBoxes.plot
var margin = require('./vars').margins.plot

module.exports = function renderPlotNumber(data, sel) {

    var width = box.w - margin.l - margin.r,
        height = box.h - margin.t - margin.b

    var gutter = 15
    var plotBox = {
        width: width*0.8 - gutter,
        height: height,
        top: 0, left: 0
    }
    var histBox = {
        width: width - plotBox.width - gutter - 5,
        height: height,
        top: 0, left: plotBox.width + gutter
    }

    var color = d3.scale.category20()

    var max = d3.max(data.values, function(d,i){return d3.max(d)}),
        min = d3.min(data.values, function(d,i){return d3.min(d)}),
        mean = d3.mean(data.values, function(d,i){return d3.mean(d)}),
        maxLength = d3.max(data.values, function(d,i){return d.length})

    var xPlot = d3.scale.linear()
        .domain([0, maxLength])
        .rangeRound([0, plotBox.width])
    var yPlot = d3.scale.linear()
        .domain([min, max])
        .rangeRound([plotBox.height, 0])

    var line = d3.svg.line()
        .x(function(d,i){return xPlot(i)})
        .y(function(d,i){return yPlot(d)})
        .defined(function(d,i){return !_.isNull(d)})

    var histogram = d3.layout.histogram()
        .bins(15)
        (_(data.values)
            .flatten(true)
            .filter(function(d,i){
                return !_.isNull(d) && !_.isUndefined(d) && !_.isNaN(d)
            })
            .value())
    
    var xHist = d3.scale.linear()
        .domain([0, _.max(histogram, 'y').y])
        .range([0, histBox.width])

    //
    // transform data
    //
    var canvasData = _.map(data.values, function(array,i){
        var points = _.map(array, function(d,i){
                return [
                    xPlot(i),
                    yPlot(d)
                ]
            })
        var line
        if (array.length > plotBox.width) {
            line = _(points)
                .groupBy(function(d,i){
                    return d[0] - d[0]%4
                })
                .map(function(d,i){
                    return [
                        +i,
                        d3.mean(d, function(d,i){return d[1]})
                    ]
                })
                .value()
        } else {
            line = points
        }

        return {
            points: points,
            line: line
        }
    })
    if (maxLength > plotBox.width) {
        var pointsData = _(canvasData)
            .pluck('points').flatten(true)
            .groupBy(function(d,i){
                return (d[0]-d[0]%2) + '|' + (d[1]-d[1]%2)
            })
            .map(function(d,i){
                var pos = i.split('|')
                var arr = [+pos[0], +pos[1]]
                arr.amount = d.length
                return arr
            })
            .value()
        var maxAmount = d3.max(pointsData, function(d,i){return d.amount})
        var grayScale = d3.scale.linear()
            .domain([1, maxAmount+1])
            .range(["#a1dab0", "#43a2ca"])
            .interpolate(d3.interpolateHcl)
            .clamp(true)
    }


    //
    //
    //
    var ctx = sel.select('canvas').node().getContext('2d')

    ctx.fillStyle = 'gray'
    ctx.lineWidth = 1
    ctx.save()
    ctx.clearRect(0,0,box.w, box.h)
    ctx.translate(margin.l, margin.t)
    if (maxLength > plotBox.width) {
        _.each(pointsData, function(d,i){
            ctx.fillStyle = grayScale(d.amount)
            ctx.fillRect(d[0], d[1], 2, 2)
        })
    }
    _.each(canvasData, function(group,i){
        if (data.values.length > 10) {
            ctx.strokeStyle = 'hsla(0,0%,20%,'+(1/(data.values.length/40))+')'
        } else {
            ctx.strokeStyle = 'hsl(0,0%,20%)'
        }
        ctx.beginPath()
        _.each(group.line, function(d,i){
            if (i==0) {
                ctx.moveTo(d[0],d[1])
            } else {
                ctx.lineTo(d[0],d[1])
            }
        })
        ctx.stroke()
    })
    ctx.restore()

    // update paths
    // var paths = sel.select('g.plots')
    //     .selectAll('path').data(data.values)
    // paths.enter().append('path')
    // paths.attr('d', line)
    //     .style({
    //         fill: 'none', 
    //         stroke: function(d,i){return color(i)}
    //     })
    // paths.exit().remove()

    // histogram
    var histBars = sel.select('g.histogram')
        .attr({ transform: 'translate('+histBox.left+','+histBox.top+')' })
        .selectAll('rect').data(histogram)
    histBars.enter().append('rect')
        .classed('histBar', true)
    histBars.exit().remove()
    histBars
        .attr({
            x: 0,
            y: function(d,i){
                return yPlot(d.x+d.dx)
            },
            width: function(d,i){
                return xHist(d.y)
            },
            height: function(d,i){
                return yPlot(d.x) - yPlot(d.x+d.dx)
            }
        })



    //labelRight
    var labelRight = sel.selectAll('g.labelRight')
        .attr({ transform: 'translate('+(width)+',0)' })
    labelRight.selectAll('path')
        .attr({ d: 'M0,0 h5' })
    labelRight.selectAll('text')
        .attr({ x: 8, 'text-anchor': 'start', dy: '.35em' })

    sel.select('g.labelRight .max')
        .select('text')
        .text(formatNumber(max))

    sel.select('g.labelRight .min')
        .attr({
            transform: 'translate(0,'+height+')',
        })
        .select('text')
        .text(formatNumber(min))
    sel.select('g.labelRight .mean')
        .attr({
            transform: 'translate(0,'+yPlot(mean)+')',
        })
        .select('text')
        .text(formatNumber(mean))

}

function formatNumber(d){
    if (d == 0) {
        return 0
    }
    if (d < 0.01 && d > -0.01) {
        return d3.format('.0e')(d)
    }
    var f = d3.formatPrefix(d)
    return d3.format('.0f')(f.scale(d))+' '+f.symbol
}