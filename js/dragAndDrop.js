
module.exports = function dragAndDrop(){

    var tid
    var dispatch = d3.dispatch('drop')

    var main = {}
    _.extend(main, {})
    main.set = function(sel) {

        window.ondragover = function(e){
            clearTimeout(tid)
            e.stopPropagation()
            e.preventDefault()
        }

        window.ondragleave = function(e){
            tid = setTimeout(function(){
                e.stopPropagation()
                e.preventDefault()
            }, 0)
        }
        window.ondrop = function(e){
            e.stopPropagation()
            e.preventDefault()

            var file = e.dataTransfer.files[0]
            console.log(file)
            var reader = new FileReader()
            reader.readAsText(file)
            reader.onload = function (event) {
                // console.log('event', event.target)
                if (_.last(file.name.split('.')) == 'csv') {
                    var data = d3.csv.parse(event.target.result, csvAccessor)
                    //dispatch received data
                    // dispatch.stringDataReceived(JSON.stringify(data))
                }
                if (_.last(file.name.split('.')) == 'json') {
                    var data = event.target.result
                    //dispatch received data
                    // dispatch.stringDataReceived(event.target.result)
                }
            }
            function csvAccessor(d) {
                var o = {}
                _.each(d, function(d,i){
                    var number = Number(d)
                    var date = new Date(d)
                    if (!_.isNaN(number)) {
                        o[i] = number
                    // } else if (!_.isNaN(date.getTime())) {
                    //     o[i] = date
                    } else {
                        o[i] = d
                    }
                })
                return o
            }
            function dateReviver(key, value) {
                if(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\d/.test(value)) {
                    return new Date(value)
                }
                return value
            }
        
            return false
        }

        return main
    }

    d3.rebind(main, dispatch, 'on')

    return main
}