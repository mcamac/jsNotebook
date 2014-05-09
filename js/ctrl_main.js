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
                main.render(emptyData)
            })

        // set files
        renderFiles.on('delete', deleteFile)

        // drop
        dragAndDrop.set()
        dragAndDrop
            .on('drop', function(d){
                console.log('drop')
            })

        this.render(data)

        return main
    }

    main.render = function(_data){
        data = _data
        renderBlock.render(d3.select('.blocks'), data.blocks)
        renderFiles.render(d3.select('.ctn-file'), data.files)
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
        localStorage.notebook = JSON.stringify(data)
    }

    function deleteFile(d){
        _.remove(data.files, d)
        main.render(data)
    }

    return main
}
