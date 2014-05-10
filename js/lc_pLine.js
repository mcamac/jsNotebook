var render_base = require('./render_base')()

module.exports = function pLine(_opts) {
    var opts = {
        data: [1,20,3,40,5],
        sel: _sel,
        y: '',
        x: 'index',
        values: '',
        xScale: 'linear',
        yScale: 'linear',
        xDomain: 'extent',
        yDomain: 'extent',
        height: .5
    }
    _.extend(opts, _opts)

    var main = {}
    _.extend(main, render_base)

    main.render = function(){
        // wrap data if needed
        this.data = opts.data
        if (_.all(this.data, _.isObject) && opts.values == '') {
            this.data = [this.data]
        }
        if (_.all(this.data, _.isNumber)) {
            this.data = [this.data]
        }

        // set basics
        var sel = _sel.append('div')

        var box = {width: 700, height: 350, top:10, left: 10, right:40, bottom: 20}
        box.height = box.width*opts.height

        this.svgBox(box)
        this.setSvg(sel)

        // set Accessors
        this.setAccessors(['x', 'y', 'values'])

        //scales
        var x = this.createScale('x')
            .range([0, this.width])
        var xAxis = d3.svg.axis()
            .scale(x)
            .ticks(this.width/80, ',.1s')
            .orient('bottom')

        var y = this.createScale('y')
            .range([this.height, 0])
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('right')

        // other
        line = d3.svg.line()
            .x(function(d,i){return x(main.acc.x(d,i))})
            .y(function(d,i){return y(main.acc.y(d,i))})

        //
        // render
        //
        var g = sel.select('g.main')
        var gLines = g.append('g').classed('lines', true)
            .selectAll('path').data(this.data)
        gLines.enter().append('path')
            .attr('d', function(d,i){
                return line(main.acc.values(d))
            })
            .style({
                fill: 'none',
                stroke: 'black'
            })

        // axis
        g.append('g')
            .classed('axis', true)
            .attr('transform', 'translate(0,'+this.height+')')
            .call(xAxis)
        g.append('g')
            .classed('axis', true)
            .attr('transform', 'translate('+this.width+',0)')
            .call(yAxis)

        // labels
        g.append('text')
            .classed('label', true)
            .attr('transform', 'translate(0,'+(this.height-5)+')')
            .text(function () {
                if (opts.xName) return opts.xName
                if (_.isString(opts.x)) return opts.x
                return ''
            })
        g.append('text')
            .classed('label', true)
            .attr({
                'transform': 'translate('+(this.width-7)+','+(this.height-5)+') rotate(-90)',
                'text-anchor': 'start'
            })
            .text(function () {
                if (opts.yName) return opts.yName
                if (_.isString(opts.y)) return opts.y
                return ''
            })

    }

    main.getDomain = function (domainType, _acc){
        var that = this
        var max = d3.max(this.data, function(d,i){
            return d3.max(main.acc.values(d), _acc)
        })
        var min = d3.min(this.data, function(d,i){
            return d3.min(main.acc.values(d), _acc)
        })
        if (domainType == 'zero') {
            return [d3.min([0,min]), d3.max([0, max])]
        }
        if (domainType == 'extent') {
            return [min, max]
        }
        print('invalid domainType')
    }

    main.setAccessors = function (accNames) {
        this.acc = {}
        _.each(accNames, function(d, i){
            var value = main.acc[d] = opts[d]
            if (_.isFunction(value)) return
            if (value == 'index') {
                main.acc[d] = function(d,i){return i}
                return
            }
            if (_.isString(value) || _.isNull(value)) return main.acc[d] = main.accessorFromString(value)
        })
    }

    main.accessorFromString = function (string){
        var identityAcc = function(d){ return d }
        if (string == '') return identityAcc
        if (_.isNull(string)) return identityAcc
        if (string == 'index') return function(d,i){return i}
        var path = string.split('.')
        return _.reduce(path, function(acc, string){
            return function(d){
                return acc(d)[string]
            }
        }, identityAcc)
    }

    main.createScale = function (name) {
        return d3.scale[opts[name+'Scale']]()
            .domain(this.getDomain(opts[name+'Domain'], this.acc[name]))
    }

    main.createScalesAndAxis = function (name){
        this[name] = d3.scale[opts[name+'Scale']]()
            // .range([0, this.width])
            .domain(this.getDomain(opts[name+'Domain'], this.acc[name]))
        this[name+'Axis'] = d3.svg.axis()
            .scale(this[name])
    }

    main.render()

}