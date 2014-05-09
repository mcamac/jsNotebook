var ctrlMain = require('./ctrl_main')()
var emptyData = require('./emptyNotebookData')

if (localStorage.notebook) {
    emptyData = JSON.parse(localStorage.notebook, dateReviver)
    function dateReviver(key, value) {
        if(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\d/.test(value)) {
            return new Date(value)
        }
        return value
    }
}

ctrlMain.init(emptyData)

//////////

var methods = {
    print: function(string){
        if (_.isObject(string)) {
            string = JSON.stringify(string)
        }
        _sel.append('div')
            .classed('print', true)
            .text(string)
    }
}

_.extend(window, methods)