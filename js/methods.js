// methods
var pLine = require('./lc_pLine')

var methods = {
    print: function(string, sel){
        sel = sel ? sel : _sel
        if (_.isObject(string)) {
            string = JSON.stringify(string)
        }
        sel.append('div')
            .classed('print', true)
            .text(string)
    },
    inject: function(string) {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = callback(_sel)
        function callback(sel) {
            return function () {
                print('script loaded', sel)
            }
        }
        script.src = string;
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    lc: {
        pLine: pLine
    }
}

_.extend(window, methods)