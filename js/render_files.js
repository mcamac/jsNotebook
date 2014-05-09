module.exports = function render_files(){

    var dispatch = d3.dispatch('delete')
    var dateFormat = d3.time.format('%b %d, %Y')
    var numberFormat = d3.format(',.1f')

    var main = {}
    main.render = function (sel, data){
        // receive .files d3.sel
        var files = sel.selectAll('.row-file').data(data, function(d,i){return d.name})
        files.enter()
            .insert(function(){
                return document.querySelector('#tpl-row-file .row-file').cloneNode(true)
            })
            .each(function (d,i) {
                // if (d.content != '') return
                var sel = d3.select(this)
                var height = this.getBoundingClientRect().height
                sel.style({
                        'height': 0+'px',
                        overflow: 'hidden',
                        opacity: 0
                    })
                    .transition()
                    .ease('linear')
                    // .duration(200)
                    .style({
                        height: height+'px',
                        opacity: 1
                    })
                    .each('end', function () {
                        d3.select(this)
                            .style('height', 'inherit')
                    })

            })

        files.select('.varName')
            .style({
                'background-color': function(d,i){
                    return _.isNull(d.content) ? 'hsl(0,50%,80%)' : ''
                }
            })
        files.select('.name')
            .text(function(d,i){return 'var '+ d.name})
        files.select('.type')
            .text(function(d,i){return d.type.toUpperCase()})
        files.select('.size')
            .text(function(d,i){return numberFormat(d.size/1000000)+' MB'})
        files.select('.date')
            .text(function(d,i){return dateFormat(d.date)})
        files.select('.delete')
            .on('click', function(d,i){
                dispatch.delete(d)
            })

        files
            .on('mouseenter', function(){
                d3.select(this).classed('showBtn', true)
            })
            .on('mouseleave', function(){
                d3.select(this).classed('showBtn', false)
            })

        files.exit()
            .each(function () {
                var sel = d3.select(this)
                var height = this.getBoundingClientRect().height
                sel.style({
                        'height': height+'px',
                        overflow: 'hidden'
                    })
                    .transition()
                    .ease('linear')
                    // .duration(200)
                    .style({
                        height: '0px',
                        opacity: '0'
                    })
                    .remove()
            })
        return main
    }
    
    d3.rebind(main, dispatch, 'on')
    return main
}