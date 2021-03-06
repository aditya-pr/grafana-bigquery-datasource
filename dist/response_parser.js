System.register(['lodash'], function(exports_1) {
    var lodash_1;
    var ResponseParser;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            ResponseParser = (function () {
                function ResponseParser($q) {
                    this.$q = $q;
                }
                ResponseParser.prototype.processQueryResult = function (res) {
                    var data = [];
		    console.log(res.data);
                    if (!res.data.rows) {
                        return { data: data };
                    }
		    services = {}
		    for (var key in res.data.rows) {
              		var queryRes = res.data.rows[key]["f"];
              		services[queryRes[2]["v"]] = (services[queryRes[2]["v"]] + parseFloat(queryRes[0]["v"])) || parseFloat(queryRes[0]["v"]);
              		index = function(data, target) {
                		for (var key in data) {
                  			if (data[key]["target"] == target) return key;
                		}
                		return -1;
             		 }(data, queryRes[2]["v"])
              		if (index != -1) {
                		data[index].datapoints.push([services[queryRes[2]["v"]], new Date(queryRes[1]["v"]).getTime()])
             		} else {
                		data.push({
                  			target: queryRes[2]["v"],
                  			datapoints: [[services[queryRes[2]["v"]], new Date(queryRes[1]["v"]).getTime()]],
                		});
              		}
            	    }

		    return { data: data };
                };
                ResponseParser.prototype.parseMetricFindQueryResult = function (refId, results) {
                    if (!results || results.data.length === 0 || results.data.results[refId].meta.rowCount === 0) {
                        return [];
                    }
                    var columns = results.data.results[refId].tables[0].columns;
                    var rows = results.data.results[refId].tables[0].rows;
                    var textColIndex = this.findColIndex(columns, '__text');
                    var valueColIndex = this.findColIndex(columns, '__value');
                    if (columns.length === 2 && textColIndex !== -1 && valueColIndex !== -1) {
                        return this.transformToKeyValueList(rows, textColIndex, valueColIndex);
                    }
                    return this.transformToSimpleList(rows);
                };
                ResponseParser.prototype.transformToKeyValueList = function (rows, textColIndex, valueColIndex) {
                    var res = [];
                    for (var i = 0; i < rows.length; i++) {
                        if (!this.containsKey(res, rows[i][textColIndex])) {
                            res.push({
                                text: rows[i][textColIndex],
                                value: rows[i][valueColIndex],
                            });
                        }
                    }
                    return res;
                };
                ResponseParser.prototype.transformToSimpleList = function (rows) {
                    var res = [];
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < rows[i].length; j++) {
                            var value = rows[i][j];
                            if (res.indexOf(value) === -1) {
                                res.push(value);
                            }
                        }
                    }
                    return lodash_1.default.map(res, function (value) {
                        return { text: value };
                    });
                };
                ResponseParser.prototype.findColIndex = function (columns, colName) {
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].text === colName) {
                            return i;
                        }
                    }
                    return -1;
                };
                ResponseParser.prototype.containsKey = function (res, key) {
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].text === key) {
                            return true;
                        }
                    }
                    return false;
                };
                ResponseParser.prototype.transformAnnotationResponse = function (options, data) {
                    var table = data.data.results[options.annotation.name].tables[0];
                    var timeColumnIndex = -1;
                    var textColumnIndex = -1;
                    var tagsColumnIndex = -1;
                    for (var i = 0; i < table.columns.length; i++) {
                        if (table.columns[i].text === 'time_sec' || table.columns[i].text === 'time') {
                            timeColumnIndex = i;
                        }
                        else if (table.columns[i].text === 'title') {
                            return this.$q.reject({
                                message: 'The title column for annotations is deprecated, now only a column named text is returned',
                            });
                        }
                        else if (table.columns[i].text === 'text') {
                            textColumnIndex = i;
                        }
                        else if (table.columns[i].text === 'tags') {
                            tagsColumnIndex = i;
                        }
                    }
                    if (timeColumnIndex === -1) {
                        return this.$q.reject({
                            message: 'Missing mandatory time column (with time_sec column alias) in annotation query.',
                        });
                    }
                    var list = [];
                    for (var i = 0; i < table.rows.length; i++) {
                        var row = table.rows[i];
                        list.push({
                            annotation: options.annotation,
                            time: Math.floor(row[timeColumnIndex]),
                            text: row[textColumnIndex] ? row[textColumnIndex].toString() : '',
                            tags: row[tagsColumnIndex] ? row[tagsColumnIndex].trim().split(/\s*,\s*/) : [],
                        });
                    }
                    return list;
                };
                return ResponseParser;
            })();
            exports_1("default", ResponseParser);
        }
    }
});
//# sourceMappingURL=response_parser.js.map
