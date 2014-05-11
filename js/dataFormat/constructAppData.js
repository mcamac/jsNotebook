//construct app data
module.exports = function (dataContainer) {

    // create first formatData
    var formatData = {
        name:'data',
        seq: []
    }

    // run choose
    choose({
        formatData: formatData,
        data: dataContainer[0].data
    })
    return  [formatData]
}

function choose (opts) {
    var formatData = opts.formatData
    var data = opts.data

    //help functions
    function numberCheck (d,i){ 
        return _.isNumber(d) || _.isNull(d)
    }
    function mapArrayToObj(d,i){
        var o = {}
        _.each(d, function(d,i){ o[i] = d })
        return o
    }

    ///////////////////////
    //is the data an array?
    if (_.isArray(data)) {
        //
        //is it an array of arrays?
        if (_.all(data, _.isArray)) {
            //is it an array of arrays of dates?
            if (_.all(data, function(d,i){ return _.all(d, _.isDate) })) {
                _.last(formatData.seq).type = 'date'
                formatData.def = 'date'
                formatData.type = 'date'
                formatData.values = data
            }
            //is it an array of arrays of arrays?
            if (_.all(data, function(d,i){ return _.all(d, _.isArray) })) {
                // if it's an array of arrays of arrays with <= 2 numbers
                if (_.all(_.flatten(data, true), function(d,i){ return d.length <=2 })) {
                    // convert the last array to an object
                    // and re-run the choose
                    var data = _.map(data, function(d,i){
                        return _.map(d, function(d,i){
                            var o = {}
                            _.each(d, function(d,i){ o[i] = d })
                            return o
                        })
                    })
                    // _.last(formatData.seq).type = 'array'
                    choose({
                        formatData: formatData,
                        data: data
                    })
                } else {
                    // else
                    // too much dimensions, merge and re-run the choose
                    _.last(formatData.seq).type = 'array'
                    choose({
                        formatData: formatData,
                        data: _.flatten(data, true)
                    })
                }
            }
            //is it an array of arrays of objects?
            if (_.all(data, function(d,i){ return _.all(d, _.isPlainObject) })) {

                // create the def
                if (!formatData.type) {
                    formatData.type = 'array'
                    formatData.arrayLength = d3.max(data, function(d,i){return d.length})
                }

                var keys = _(data).flatten()
                    .map(function(d,i){return _.keys(d)})
                    .flatten().uniq()
                    .value()
                var rows = _.map(keys, function(key){
                    var values = _.map(data, function(d,i){
                            return _.map(d, function(d,i){
                                return d[key]
                            })
                        })
                    var seq = _.clone(formatData.seq)
                    seq.push({name: key, id: _.uniqueId()})
                    var row = {
                        name: key,
                        seq: seq
                    }
                    choose({
                        formatData: row,
                        data: values
                    })
                    return row
                })
                if (!_.last(formatData.seq).type) {
                    _.last(formatData.seq).type = 'object'
                    formatData.type = 'object'
                }
                formatData.rows = rows
            }
            //is it an array of arrays of strings?
            if (_.all(data, function(d,i){ return _.all(d, _.isString) })) {
                _.last(formatData.seq).type = 'string'
                formatData.type = 'string'
                formatData.values = data
            }
            //is it an array of arrays of numbers?
            if (_.all(data, function(d,i){ return _.all(d, numberCheck) })) {
                _.last(formatData.seq).type = 'number'
                formatData.type = 'number'
                formatData.values = data
            }
        }
        //
        //is it an array of objects?
        if (_.all(data, _.isPlainObject)) {
            // wrap it in an array and re-run the choose
            formatData.seq.push({
                name: 'data',
                type: 'array',
                id: _.uniqueId()
            })
            choose({
                formatData: formatData,
                data: [data]
            })
        }
        //
        //is it an array of strings?
        if (_.all(data, _.isString)) {
            // wrap it in an array and re-run the choose
            choose({
                formatData: formatData,
                data: [data]
            })
        }
        //
        //is it an array of numbers?
        if (_.all(data, numberCheck)) {
            // wrap it in an array and re-run the choose
            choose({
                formatData: formatData,
                data: [data]
            })
        }
    }
    /////////////////////////
    //is the data an object?
    if (_.isPlainObject(data)) {
        formatData.seq.push({
            name: 'data',
            type: 'object', 
            id: _.uniqueId()
        })
        formatData.type = 'object'
        choose({
            formatData: formatData,
            data: [[data]]
        })
    }
    //is the data a string?
    if (_.isString(data)) {
        formatData.type = 'string'
        formatData.values = data
    }
    //is the data a number?
    if (_.isNumber(data)) {
        formatData.type = 'number'
        formatData.values = data
    }
}