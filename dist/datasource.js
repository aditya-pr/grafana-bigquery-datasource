///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', './response_parser'], function(exports_1) {
    var lodash_1, response_parser_1;
    var BigQueryDatasource;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (response_parser_1_1) {
                response_parser_1 = response_parser_1_1;
            }],
        execute: function() {
            BigQueryDatasource = (function () {
                /** @ngInject */
                function BigQueryDatasource(instanceSettings, backendSrv, templateSrv, $q) {
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.$q = $q;
                    this.id = instanceSettings.id;
                    this.name = instanceSettings.name;
                    this.url = 'https://www.googleapis.com/bigquery/v2/projects/inapp-infrastructure-190215/datasets/';
                    this.authToken = instanceSettings.jsonData.authToken;
                    this.responseParser = new response_parser_1.default(this.$q);
                }
                BigQueryDatasource.prototype.doRequest = function (options) {
                    options.url = this.url;
                    options.headers = {
                        Authorization: "Bearer " + this.authToken,
                    };
                    return this.backendSrv.datasourceRequest(options);
                };
                BigQueryDatasource.prototype.doQueryRequest = function (options) {
                    options.url = 'https://www.googleapis.com/bigquery/v2/projects/inapp-infrastructure-190215/queries';
                    options.headers = {
                        Authorization: "Bearer " + this.authToken,
                    };
                    options.method = 'POST';
                    options.data = {
                        useLegacySql: false,
                        query: "select sum(cost), FORMAT_TIMESTAMP('%Y/%m/%d', export_time) as exporttime, service.description from `inapp-infrastructure-190215.InAppBillingExport.gcp_billing_export_v1_015F6F_B1E514_A875E2`  where invoice.month = FORMAT_DATE('%Y%m', CURRENT_DATE()) group by exporttime, service.description order by exporttime;",
                    };
             
	 	    return this.backendSrv.datasourceRequest(options).then(this.responseParser.processQueryResult);
                };
                BigQueryDatasource.prototype.testDatasource = function () {
                    return this.doRequest({
                        url: this.url,
                        method: 'GET',
                        authToken: this.authToken,
                    }).then(function (response) {
                        if (response.status === 200) {
                            return { status: "success", message: "Data source is working", title: "Success" };
                        }
                        else {
                            return { status: "error", message: "Data source hates you", title: "I want to die" };
                        }
                    });
                };
                BigQueryDatasource.prototype.query = function (options) {
                    var _this = this;
                    var queries = lodash_1.default.filter(options.targets, function (item) {
                        return item.hide !== true;
                    }).map(function (item) {
                        return {
                            refId: item.refId,
                            datasourceId: _this.id,
                            rawSql: item.rawSql.replace("\n", " "),
                        };
                    });
                    if (queries.length === 0) {
                        return this.$q.when({ data: [] });
                    }
                    return this.doQueryRequest({
                        url: 'https://www.googleapis.com/bigquery/v2/projects/trv-hs-hackathon-2018-test/queries',
                        authToken: this.authToken,
                        query: queries.rawSql,
                    });
                    /*
                    return this.backendSrv
                      .datasourceRequest({
                        //remove hardcoded project later and use variable from configCtrl
                        url: 'https://www.googleapis.com/bigquery/v2/projects/trv-hs-hackathon-2018-test/queries',
                        method: 'POST',
                        data: {
                          from: options.range.from.valueOf().toString(),
                          to: options.range.to.valueOf().toString(),
                          //query: queries.rawSql,
                          useLegacySql: false,
                        },
                      })
                      .then(this.responseParser.processQueryResult);*/
                };
                BigQueryDatasource.prototype.annotationQuery = function (options) {
                    throw new Error("Annotation Support not implemented yet.");
                };
                BigQueryDatasource.prototype.metricFindQuery = function (query) {
                    throw new Error("Template Variable Support not implemented yet.");
                };
                return BigQueryDatasource;
            })();
            exports_1("default", BigQueryDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map
