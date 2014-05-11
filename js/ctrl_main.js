var renderBlock = require('./render_block')()
var renderFiles = require('./render_files')()
var dragAndDrop = require('./dragAndDrop')()
var emptyData = require('./emptyNotebookData')

module.exports = function ctrl_main(){

    var data 

    var main = {}
    main.init = function (_data){
        data = _data

        // set block
        renderBlock.on('delete', deleteBlock)
        renderBlock.on('new', newBlock)
        renderBlock.on('update', saveDataLocally)

        d3.select('.btn-fullClean')
            .on('click', function(){
                delete localStorage.notebook
                main.render(_.cloneDeep(emptyData))
            })

        // set files
        renderFiles.on('delete', deleteFile)

        // drop
        dragAndDrop.set()
        dragAndDrop
            .on('drop', drop)

        initFiles()
        this.render(data)

        // run all evals on the page
        d3.select('.blocks')
            .selectAll('.eval').each(function(){ this.click() })

        window._sel = d3.select('.ctn-output')
        window._node = window._sel.node()

        return main
    }

    main.render = function(_data){
        data = _data
        renderBlock.render(d3.select('.blocks'), data.blocks)
        renderFiles.render(d3.select('.ctn-file'), data.files)
        saveDataLocally()
    }

    function initFiles () {
        _.each(data.files, function(d,i){
            window[d.name] = d.content
        })
    }

    function deleteBlock(d){
        var id = d3.max(data.blocks, function(d,i){return d.id})+1
        _.remove(data.blocks, d)
        if (data.blocks.length == 0) {
            data.blocks.push({
                content:'',
                id: id
            })
        }
        main.render(data)
    }

    function newBlock(d){
        var id = d3.max(data.blocks, function(d,i){return d.id})+1,
            index = _.indexOf(data.blocks, d)
        data.blocks.splice(index+1, 0, {
            content:'',
            id: id
        })
        main.render(data)
    }

    function saveDataLocally(){
        var dataToSave = {
            meta: data.meta,
            blocks: data.blocks,
            files: _.map(data.files, function(d,i){
                if (d.size < 2500000) return d
                return { content: null, name: d.name, type: d.type, size: d.size, date: d.date }
            })
        }
        localStorage.notebook = JSON.stringify(dataToSave)
    }

    function deleteFile(d){
        _.remove(data.files, d)
        main.render(data)
    }

    function drop(d){
        var prev = _.find(data.files, function(d2,i){
            return d2.name == d.name
        })
        if (prev) {
            _.remove(data.files, prev)
        }
        data.files.push(d)
        window[d.name] = d.content
        main.render(data)
    }

    return main
}
