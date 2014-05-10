var CodeMirror = require('../bower_components/codemirror/lib/codemirror.js')
require('../bower_components/codemirror/mode/javascript/javascript.js')
require('../bower_components/codemirror/keymap/sublime.js')
require('../bower_components/codemirror/addon/edit/matchbrackets.js')
require('../bower_components/codemirror/addon/edit/closebrackets.js')
require('../bower_components/codemirror/addon/comment/comment.js')
require('../bower_components/codemirror/addon/hint/show-hint.js')
require('../bower_components/codemirror/addon/hint/javascript-hint.js')
require('../bower_components/codemirror/addon/selection/active-line.js')


module.exports = function render_block(){

    var dispatch = d3.dispatch('delete', 'new', 'update')

    var main = {}
    main.render = function (sel, data){
        // receive .blocks d3.sel
        var blocks = sel.selectAll('.block').data(data, function(d,i){return d.id})
        blocks.enter()
            .insert(function(){
                return document.querySelector('#tpl-block .block').cloneNode(true)
            })
            .each(setEditorForEach)
            .each(function (d,i) {
                if (d.content != '') return
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

        // blocks.order()

        blocks.select('.number')
            .text(function(d,i){return i+1})
        blocks.select('.delete')
            .on('click', function(d,i){
                dispatch.delete(d)
                dispatch.update(d)
            })
        blocks.select('.new')
            .on('click', function(d,i){
                dispatch.new(d)
                dispatch.update(d)
            })
        blocks.select('.ctn-input')
            .on('mouseenter', function(){
                d3.select(this).classed('showBtn', true)
            })
            .on('mouseleave', function(){
                d3.select(this).classed('showBtn', false)
            })

        blocks.exit()
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

        function setEditorForEach(d,i){
            var sel = d3.select(this)
            var editor = CodeMirror(this.querySelector('.textEditor'),
                {
                    value: d.content,
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    indentWithTabs: true,
                    tabSize: 4,
                    indentUnit: 4,
                    dragDrop: false,
                    // autofocus: true,
                    lineWrapping: true,
                    keyMap: 'sublime',
                    // styleActiveLine: true,
                    extraKeys: {
                        'Esc': 'autocomplete',
                        'Cmd-E': evaluate
                    },
                }
            )
            editor.on('update', function(cm){
                d.content = cm.doc.getValue()
                dispatch.update(d)
            })
            sel.select('.eval')
                .on('click', function(){
                    evaluate(editor)
                })
            function evaluate(cm){
                // clean
                sel.select('.output')
                    .selectAll('*').remove()
                sel.select('.output')
                    .append('div')
                    .classed('ctn-output', true)
                // set vars
                window._sel = sel.select('.ctn-output')
                window._node = window._sel.node()
                window._datum = sel.datum()

                var value = cm.doc.getValue()
                try {
                    var r = eval.call(window, value)
                } catch(e) {
                    sel.select('.ctn-output')
                        .append('div')
                        .classed('error', true)
                        .text('error: '+ e.message)
                    return
                }
                print(r)
                sel.select('.ok')
                    .style({opacity: 1})
                    .transition()
                    .delay(500)
                    .style({opacity: 0})
            }
        }
        return main
    }
    
    d3.rebind(main, dispatch, 'on')

    return main
}