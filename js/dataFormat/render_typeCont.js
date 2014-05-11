// render node typeCont

var box = require('./vars').nodeElemBoxes.typeCont

module.exports = function (sel) {
    sel.each(each)
}

function each (d,i) {
    var sel = d3.select(this)

    if (d.type != 'array') sel.style({'background-color': 'hsl(0,0%,35%)'})
 

    sel.select('svg')
        .attr({
            width: box.w, height: box.h
        })
    if (d.type == 'array') {
    sel.select('svg')
        .on('mousemove', function () {
            var mouse = d3.mouse(this)
            path.attr({transform: 'translate('+mouse[0]+',0)'})
        })
        .on('mouseleave', function () {
            path
                .transition()
                .attr({transform: 'translate(-10,0)'})
        })
    }

    sel.select('text')
        .attr({
            x: box.w/2,
            y: box.h/2,
            'text-anchor': 'middle',
            dy: '.30em'
        })
        .text(function(){
            if (d.type == 'array') {
                var f = d3.formatPrefix(d.arrayLength)
                return d3.format('.0f')(f.scale(d.arrayLength))+''+f.symbol
            }
            if (d.type == 'object') return '{}'
            return d.type
        })

    var path = sel.select('path')
        .attr({
            d: 'M0,1 v'+(box.h-2),
            transform: 'translate(-10,0)'
        })
}