var config = require("../config/db.config");
const sql = require('mssql');
const { request } = require("express");
const excelJS = require("exceljs");
var XLSX = require('xlsx');
var http = require('http');
var fs = require('fs');
var cors = require('cors');
var pixelWidth = require('string-pixel-width');
const { Console } = require("console");

// get chart List........................
exports.getChartList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.execute("sp_GetChartList", function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != "") {
                        res.send(200, {
                            "error": 1,
                            "msg": recordsets.output.error_msg
                        })
                    } else {
                        res.send({
                            "error": 0,
                            "data": recordsets.recordset
                        }, 200)
                    }
            })
        })

        //Handle connection errors
        .catch(function (err) {
            conn.close();
        });

}
// insert chart........................
exports.insertChart = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);

            req.input("Login_id", request.body.Login_id);
            req.input("Shift_Name", request.body.shift_Name);
            req.input("StationId", request.body.stationId);

            column.columns.add("", sqlInt)
            column.columns.add('CFlag', sql.Int);
            column.columns.add('SrNo', sql.Int);
            column.columns.add('CharacteristicName', sql.VarChar(100));
            column.columns.add('CharacteristicsTypeID', sql.Int);
            column.columns.add('CharacteristicType', sql.VarChar(10));
            column.columns.add('UnitID', sql.Int);
            column.columns.add('Unit', sql.VarChar(100));
            column.columns.add('USL', sql.Decimal(18, 6));
            column.columns.add('LSL', sql.Decimal(18, 6));
            column.columns.add('Mean', sql.Decimal(18, 6));
            column.columns.add('UPCL', sql.Decimal(18, 6));
            column.columns.add('LPCL', sql.Decimal(18, 6));
            column.columns.add('MasterSize', sql.Decimal(18, 6));
            column.columns.add('GaugeSourceID', sql.Int);
            column.columns.add('GaugeSource', sql.VarChar(8));
            column.columns.add('Frequency', sql.Int);
            column.columns.add('Attachement', sql.VarChar(sql.MAX));

            var list = request.body.charList;
            list.forEach(element => {
                column.rows.add(element.CFlag, element.SrNo, element.CharacteristicName, element.CharacteristicsTypeID, element.CharacteristicType, element.UnitID,
                    element.Unit, element.USL, element.LSL, element.Mean, element.UPCL, element.LPCL, element.MasterSize, element.GaugeSourceID, element.GaugeSource, element.Frequency, element.Attachement);
            });

            req.input("udtChartCharacteristric", column);

            req.execute('sp_insertChart', function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.DB != null && recordsets.output != '') {
                        res.send(200, {
                            "error": 1,
                            "reference": recordsets.output.DB,
                            "data": recordsets.output.error_msg,
                        })
                    } else {
                        res.send({
                            "error": 0,
                            "data": recordsets.recordset,
                        }, 200)
                    }
            })
        })
        // Handle connection errors
        .catch(function (err) {
            conn.close();
        });
}

// get chart details.........................
exports.getChartDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input('Login_Id', request.query.Login_Id);
            req.execute("select * from MstMachine", function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != "") {
                        res.send(200, {
                            "error": 1,
                            "msg": recordsets.output.error_msg
                        })
                    } else {
                        res.send({
                            "error": 0,
                            "data": recordsets.recordset
                        }, 200)
                    }
            })
        })
}

// get chart data.......................
exports.getChartData = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input('Login_id', request.query.Login_id);
            req.input('StationId', request.query.StationId);
            req.input('TemplateId', request.query.TemplateId);
            req.input('MachineId', request.query.MachineId);
            req.input('Pallete', request.query.Pallete);
            req.input('CharacteristicsIds', request.query.CharacteristicsId);
            req.input('DateRangeType', request.query.DateRangeType);
            req.input('FromDate', request.query.FromDate);
            req.input('ToDate', request.query.ToDate);
            req.input('Shift1', request.query.Shift1);
            req.input('Shift2', request.query.Shift2);
            req.input('Shift3', request.query.Shift3);
            req.input('ChartTypeID', request.query.ChartTypeID);
            req.input('Subgroup', request.query.Subgroup);
            req.input('EventIds', request.query.EventIds);
            req.input('ControlLimitOption', request.query.ControlLimitOption);
            req.input('ExportOptionIds', request.query.ExportOptionIds);
            req.output('Message', sql.VarChar(sql.MAX));


            req.execute("sp_GetChartData", function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.Message != null && recordsets.output.Message != "") {
                        res.send(200, {
                            "error": 1,
                            "msg": recordsets.output.Message
                        })
                    } else {
                        var header = {};
                        if (recordsets != null) {
                            var chart_config = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[0] : null;
                            header.chart_config = chart_config;
                            var chart_data = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[1] : [];
                            // for(var i=0; i < chart_data.length; i++){
                            //     if(chart_data[i]['DateTime'] != null && chart_data[i]['DateTime'] != ''){
                            //         chart_data[i]['DateTime'] = chart_data[i]['DateTime'].replaceAll('/','-');
                            //     }
                            // }
                            console.log('chart data : ',chart_data);
                            if (header != null) {
                                header.chart_data = chart_data;
                            }
                            var data_table = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[2] : [];
                            if (header != null) {
                                header.data_table = data_table;
                            }
                            res.send({
                                'error': 0,
                                'data': header
                            }, 200)
                        }
                    }
            })
        })
}

// export to excel.......................
exports.exportsToExcel = async (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);

            req.input('Login_id', request.query.Login_id);
            req.input('StationId', request.query.StationId);
            req.input('TemplateId', request.query.TemplateId);
            req.input('MachineId', request.query.MachineId);
            req.input('Pallete', request.query.Pallete);
            req.input('CharacteristicsIds', request.query.CharacteristicsId);
            req.input('DateRangeType', request.query.DateRangeType);
            req.input('FromDate', request.query.FromDate);
            req.input('ToDate', request.query.ToDate);
            req.input('Shift1', request.query.Shift1);
            req.input('Shift2', request.query.Shift2);
            req.input('Shift3', request.query.Shift3);
            req.input('ChartTypeID', request.query.ChartTypeID);
            req.input('Subgroup', request.query.Subgroup);
            req.input('EventIds', request.query.EventIds);
            req.input('ControlLimitOption', request.query.ControlLimitOption);
            req.input('ExportOptionIds', request.query.ExportOptionIds);


            req.execute("sp_GetChartData_Export", function (err, recordsets, returnValue) {
                // console.log('export to excel 1', recordsets.recordsets);
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != "") {
                        res.send(200, {
                            "error": 1,
                            "msg": recordsets.output.error_msg
                        })
                    } else {
                        if (recordsets != null) {
                            var fileName;
                            if (request.query.ChartTypeID == '1') {
                                if(recordsets.recordsets[0].length > 0){
                                    const wb = XLSX.utils.book_new();
                                    var currentDate;
                                    console.log('export to excel 1', recordsets.recordsets[0]);
                                    // console.log('export to excel 1', recordsets.recordsets[0][1].length);
                                    if (recordsets.recordsets[0].length != 0) {
                                        var obj = recordsets.recordsets[0];
                                        var keys = Object.keys(obj[0]);
                                        // console.log('keys....',keys);
                                        for (var i = 0; i < keys.length; i++) {
                                            if(keys[i] != 'TimeStamp' && keys[i] != 'SerialNo' && keys[i] != 'Machine' && keys[i] != 'Model'
                                            && keys[i] != 'Operator' && keys[i] != 'Pallete' && keys[i] != 'SHIFT'){
                                                for(var j=0; j < obj.length; j++){
                                                    if(obj[j][keys[i]] == 1){
                                                        obj[j][keys[i]] = 'pass';
                                                    }else if(obj[j][keys[i]] == 0){
                                                        obj[j][keys[i]] = 'fail';
                                                    }
                                                }
                                            }
                                        }
                                        // var dataArr1 = recordsets.recordsets[0];
                                       
    
                                        var ws = XLSX.utils.json_to_sheet(obj)
                                        //   XLSX.utils.sheet_add_json(ws,dataArr2,{origin: dataArr1.length+2})                               
                                        let d = new Date();
                                        currentDate = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.getHours()}_${d.getMinutes()}`;
                                        var sheetName = 'Runchart'
                                        XLSX.utils.book_append_sheet(wb, ws, sheetName)
    
                                    }
                                    XLSX.writeFile(wb, './document/RunChartData_' + currentDate + '.xlsx')
                                    fileName = 'RunChartData_' + currentDate + '.xlsx';
                                    if (fileName != null && fs.existsSync('./document/' + fileName)) {
                                        res.download("./document/" + fileName)
                                    }
                                }else{
                                    res.send({
                                        "error": 1,
                                        "msg": 'Data not available for download.'
                                    }, 200)
                                }    
                            }
                            else if (request.query.ChartTypeID == '2') {
                                if(recordsets.recordsets[0].length > 0 && recordsets.recordsets[1].length > 0 && recordsets.recordsets[2].length > 0){
                                    const wb = XLSX.utils.book_new();
                                    var currentDate;
                                    for (var i = 0; i < recordsets.recordsets[0].length; i++) {
                                        var dataArr1 = [];
                                        var dataArr2 = [];
                                        for (var j = 0; j < recordsets.recordsets[1].length; j++) {
                                            if (recordsets.recordsets[0][i]['CharacteristicId'] == recordsets.recordsets[1][j]['CharacteristicsId']) {
                                                var mapData = {
                                                    'Key': recordsets.recordsets[1][j]['Key'],
                                                    'Value': recordsets.recordsets[1][j]['Value'],
                                                }
                                                dataArr1.push(mapData);
                                            }
                                        }
                                        for (var j = 0; j < recordsets.recordsets[2].length; j++) {
                                            if (recordsets.recordsets[0][i]['CharacteristicId'] == recordsets.recordsets[2][j]['CharacterID']) {
                                                var mapData = {
                                                    'Obs': recordsets.recordsets[2][j]['Obs'],
                                                    'TimeStamp': recordsets.recordsets[2][j]['TimeStamp'],
                                                    'value': recordsets.recordsets[2][j]['value'],
                                                    'SerialNo': recordsets.recordsets[2][j]['SerialNo'],
                                                    'DATE': recordsets.recordsets[2][j]['DATE'],
                                                    'Machine': recordsets.recordsets[2][j]['Machine'],
                                                    'Model': recordsets.recordsets[2][j]['Model'],
                                                    'Operator': recordsets.recordsets[2][j]['Operator'],
                                                    'Pallete': recordsets.recordsets[2][j]['Pallete'],
                                                    'SHIFT': recordsets.recordsets[2][j]['SHIFT'],
                                                    'NOTE': recordsets.recordsets[2][j]['NOTE'],
                                                    'Xbar': recordsets.recordsets[2][j]['Xbar'],
                                                    'RBar': recordsets.recordsets[2][j]['RBar'],
                                                }
                                                dataArr2.push(mapData);
                                            }
                                        }
                                        var ws = XLSX.utils.json_to_sheet(dataArr1)
                                        XLSX.utils.sheet_add_json(ws, dataArr2, { origin: dataArr1.length + 2 })
                                        let d = new Date();
                                        currentDate = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.getHours()}_${d.getMinutes()}`;
                                        var sheetName = recordsets.recordsets[0][i]['CharacteristicName']
                                        XLSX.utils.book_append_sheet(wb, ws, sheetName)
    
                                    }
                                    XLSX.writeFile(wb, './document/XbarChartData_' + currentDate + '.xlsx')
                                    fileName = 'XbarChartData_' + currentDate + '.xlsx';
                                    if (fileName != null && fs.existsSync('./document/' + fileName)) {
                                        res.download("./document/" + fileName)
                                    }
                                }else{
                                    res.send({
                                        "error": 1,
                                        "msg": 'Data not available for download.'
                                    }, 200)
                                }  
                            }
                        } else {
                            res.send({
                                "error": 1,
                                "msg": 'Data not available for download.'
                            }, 200)
                        }
                    }
            })
        })
}

const _autoFitColumns = (json, worksheet, header) => {
    const jsonKeys = header || Object.keys(json[0])
    const objectMaxLength = []
    jsonKeys.forEach((key) => {
        objectMaxLength.push(
            pixelWidth(key, {
                size: 2,
            })
        )
    })

    json.forEach((data, i) => {
        const value = json[i]
        jsonKeys.forEach((key, j) => {
            const l = value[jsonKeys[j]]
                ? jsonKeys[j] == 'Scan Datetime' ? 12 : pixelWidth(value[jsonKeys[j]], {
                    size: 1,
                })
                : 0
            objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l
        })
    })

    return objectMaxLength.map((w) => {
        return { width: w }
    })
}



//update chart
exports.updateChart = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            var column = new sql.Table();

            column.columns.add('Module', sql.VarChar(100));
            column.columns.add('ModuleID', sql.Int);
            column.columns.add('Module/Feature', sql.VarChar(100));
            column.columns.add('FullControl', sql.Bit);
            column.columns.add('Read', sql.Bit);
            column.columns.add('Write', sql.Bit);
            column.columns.add('Delete', sql.Bit);
            column.columns.add('Replicate', sql.Bit);

            var roleAccess = request.body.roleAccessData;
            roleAccess.forEach(element => {
                column.rows.add(element.Module, element.ModuleID, element.ModuleFeature, element.FullControl, element.Read,
                    element.write, element.Delete,
                    element.replicate);
            });

            req.input("Login_Id", request.body.Login_Id);
            req.input("role_id", request.body.role_id);
            req.input("role_name", request.body.role_name);
            req.input("IsOperatorRole", request.body.IsOperatorRole);
            req.input("modify_Version", request.body.ModifiedVersion);
            req.input('udtChartModuleAccess', column);

            req.execute("sp_UpdateRole", function (err, recordsets, returnValue) {
                if (err) res.send(err);
                else
                    if (recordsets.output != null && recordsets.output.errormsg != null && recordsets.output.errormsg != "") {
                        res.send(200, {
                            "error": 1,
                            "msg": recordsets.output.errormsg
                        })
                    } else {
                        res.send({
                            "error": 0,
                            "msg": recordsets.recordset
                        }, 200)
                    }
            })

        })
        //Handle connection error
        .catch(function (err) {
            conn.close();
        });
}

// export to MES 
exports.exportsToMes = async (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);

            req.input('Login_id', request.query.Login_id);
            req.input('StationId', request.query.StationId);
            req.input('TemplateId', request.query.TemplateId);
            req.input('MachineId', request.query.MachineId);
            req.input('Pallete', request.query.Pallete);
            req.input('CharacteristicsIds', request.query.CharacteristicsId);
            req.input('DateRangeType', request.query.DateRangeType);
            req.input('FromDate', request.query.FromDate);
            req.input('ToDate', request.query.ToDate);
            req.input('Shift1', request.query.Shift1);
            req.input('Shift2', request.query.Shift2);
            req.input('Shift3', request.query.Shift3);
            req.input('ChartTypeID', request.query.ChartTypeID);
            req.input('Subgroup', request.query.Subgroup);
            req.input('EventIds', request.query.EventIds);
            req.input('ControlLimitOption', request.query.ControlLimitOption);
            req.input('ExportOptionIds', request.query.ExportOptionIds);


            req.execute("sp_GetChartData_MESExport", function (err, recordsets, returnValue) {
                console.log("export to mes ", recordsets)
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != "") {
                        res.send(200, {
                            "error": 1,
                            "msg": recordsets.output.error_msg
                        })
                    } else {
                        if (recordsets != null && recordsets.recordsets[0].length > 0 && recordsets.recordsets[1].length > 0) {
                            var fileName;
                            if (request.query.ChartTypeID == '1') {
                                const wb = XLSX.utils.book_new();
                                var currentDate;
                                for (var i = 0; i < recordsets.recordsets[0].length; i++) {
                                    var dataArr1 = [];
                                    var dataArr2 = [];
                                    for (var j = 0; j < recordsets.recordsets[1].length; j++) {
                                        if (recordsets.recordsets[0][i]['CharacteristicId'] == recordsets.recordsets[1][j]['CharacterID']) {
                                            var mapData = {
                                                'CharacterID': recordsets.recordsets[1][j]['CharacterID'],
                                                'DateTime': recordsets.recordsets[1][j]['DateTime1'],
                                                'Reading': recordsets.recordsets[1][j]['Reading'],
                                                'Event': recordsets.recordsets[1][j]['Event'],
                                            }
                                            dataArr2.push(mapData);
                                        }
                                    }
                                    var ws = XLSX.utils.json_to_sheet(dataArr2)
                                    let d = new Date();
                                    currentDate = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.getHours()}_${d.getMinutes()}`;
                                    var sheetName = recordsets.recordsets[0][i]['CharacteristicName']
                                    XLSX.utils.book_append_sheet(wb, ws, sheetName)

                                }
                                XLSX.writeFile(wb, './document/MesRunChartData_' + currentDate + '.xlsx')
                                fileName = 'MesRunChartData_' + currentDate + '.xlsx';
                                if (fileName != null && fs.existsSync('./document/' + fileName)) {
                                    res.download("./document/" + fileName)
                                }
                            }
                            else if (request.query.ChartTypeID == '2') {
                                const wb = XLSX.utils.book_new();
                                var currentDate;
                                for (var i = 0; i < recordsets.recordsets[0].length; i++) {
                                    var dataArr1 = [];
                                    var dataArr2 = [];
                                    for (var j = 0; j < recordsets.recordsets[1].length; j++) {
                                        if (recordsets.recordsets[0][i]['CharacteristicId'] == recordsets.recordsets[1][j]['CharacterID']) {
                                            var mapData = {
                                                'CharacterID': recordsets.recordsets[1][j]['CharacterID'],
                                                'DateTime': recordsets.recordsets[1][j]['DateTime1'],
                                                'Reading': recordsets.recordsets[1][j]['Reading'],
                                                'Event': recordsets.recordsets[1][j]['Event'],
                                            }
                                            dataArr2.push(mapData);
                                        }
                                    }
                                    var ws = XLSX.utils.json_to_sheet(dataArr2)
                                    let d = new Date();
                                    currentDate = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.getHours()}_${d.getMinutes()}`;
                                    var sheetName = recordsets.recordsets[0][i]['CharacteristicName']
                                    XLSX.utils.book_append_sheet(wb, ws, sheetName)

                                }
                                XLSX.writeFile(wb, './document/MesXbarChartData_' + currentDate + '.xlsx')
                                fileName = 'MesXbarChartData_' + currentDate + '.xlsx';
                                if (fileName != null && fs.existsSync('./document/' + fileName)) {
                                    res.download("./document/" + fileName)
                                }
                            }
                        } else {
                            res.send({
                                "error": 1,
                                "msg": 'Data not available for download.'
                            }, 200)
                        }
                    }
            })
        })
}
