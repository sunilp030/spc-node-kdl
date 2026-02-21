var config = require("../config/db.config");
const sql = require('mssql');
var XLSX = require('xlsx');
var fs = require('fs');
var pixelWidth = require('string-pixel-width');
const { getSafeFilePath } = require('../utils/fileHelper');

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
exports.insertChart = async (request, res) => {
    const conn = new sql.ConnectionPool(config);

    try {
        await conn.connect();
        const req = new sql.Request(conn);

        // Validate and default charList
        const list = Array.isArray(request.body.charList) ? request.body.charList : [];

        // Define TVP columns
        const column = new sql.Table();
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

        // Add rows safely
        try {
            list.forEach(element => {
                column.rows.add(
                    element.CFlag || 0,
                    element.SrNo || 0,
                    element.CharacteristicName || '',
                    element.CharacteristicsTypeID || 0,
                    element.CharacteristicType || '',
                    element.UnitID || 0,
                    element.Unit || '',
                    element.USL || 0,
                    element.LSL || 0,
                    element.Mean || 0,
                    element.UPCL || 0,
                    element.LPCL || 0,
                    element.MasterSize || 0,
                    element.GaugeSourceID || 0,
                    element.GaugeSource || '',
                    element.Frequency || 0,
                    element.Attachement || ''
                );
            });
        } catch (err) {
            console.error('Error building chart TVP rows:', err);
            return res.status(400).send({ error: 1, msg: 'Invalid chart data format.' });
        }

        // Bind the TVP
        req.input("udtChartCharacteristric", column);
        req.input("Login_id", request.body.Login_id);
        req.input("Shift_Name", request.body.shift_Name);
        req.input("StationId", request.body.stationId);

        // Execute stored procedure safely
        req.execute('sp_insertChart', (err, recordsets) => {
            if (err) {
                console.error('SQL execution error:', err);
                return res.status(500).send({ error: 1, msg: 'Internal server error.' });
            }

            if (recordsets.output && recordsets.output.DB) {
                return res.status(200).send({
                    error: 1,
                    reference: recordsets.output.DB,
                    data: recordsets.output.error_msg || ''
                });
            }

            return res.status(200).send({
                error: 0,
                data: recordsets.recordset || []
            });
        });

    } catch (err) {
        console.error('Error inserting chart:', err);
        return res.status(500).send({ error: 1, msg: 'Database connection error.' });
    } finally {
        conn.close();
    }
};


// get chart details.........................
exports.getChartDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input('Login_Id', request.query.Login_Id);
            req.query("select * from MstMachine", function (err, recordsets) {
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
                            console.log('chart data : ', chart_data);
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
    const conn = new sql.ConnectionPool(config);

    try {
        await conn.connect();
        const req = new sql.Request(conn);

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

        const result = await req.execute("sp_GetChartData_Export");

        if (!result || !result.recordsets || result.recordsets.length === 0) {
            return res.status(200).send({
                error: 1,
                msg: 'Data not available for download.'
            });
        }

        const wb = XLSX.utils.book_new();
        const currentDate = new Date();
        const timestamp = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getMinutes()}`;

        if (request.query.ChartTypeID === '1') {

            const data = result.recordsets[0];
            if (!data || data.length === 0) {
                return res.status(200).send({ error: 1, msg: 'No data available.' });
            }

            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'Runchart');

            try {
                const fileName = `RunChartData_${timestamp}.xlsx`;
                const safePath = getSafeFilePath(fileName);

                XLSX.writeFile(wb, safePath);

                return res.download(safePath, fileName, {
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                });
            } catch (err) {
                console.error('File path error:', err);
                return res.status(400).send({ error: 1, msg: err.message });
            }
        }

        if (request.query.ChartTypeID === '2') {

            const data = result.recordsets[0];
            if (!data || data.length === 0) {
                return res.status(200).send({ error: 1, msg: 'No data available.' });
            }

            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'XbarChart');

            try {
                const fileName = `XbarChartData_${timestamp}.xlsx`;
                const safePath = getSafeFilePath(fileName);

                XLSX.writeFile(wb, safePath);

                return res.download(safePath, fileName, {
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                });
            } catch (err) {
                console.error('File path error:', err);
                return res.status(400).send({ error: 1, msg: err.message });
            }
        }

        return res.status(400).send({ error: 1, msg: 'Invalid Chart Type' });

    } catch (err) {
        console.error('Excel export error:', err);
        return res.status(500).send({ error: 1, msg: 'Internal server error' });
    } finally {
        conn.close();
    }
};

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
                                var currentDate = new Date();
                                const timestamp = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.getHours()}_${d.getMinutes()}`;

                                for (let i = 0; i < recordsets.recordsets[0].length; i++) {
                                    var dataArr1 = [];
                                    var dataArr2 = [];
                                    for (let j = 0; j < recordsets.recordsets[1].length; j++) {
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
                                    var sheetName = recordsets.recordsets[0][i]['CharacteristicName']
                                    XLSX.utils.book_append_sheet(wb, ws, sheetName)

                                }
                                try {
                                    const fileName = `MesRunChartData_${timestamp}.xlsx`;
                                    const safePath = getSafeFilePath(fileName);
                                    XLSX.writeFile(wb, safePath);

                                    res.download(safePath, fileName, {
                                        headers: {
                                            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                        }
                                    });
                                } catch (err) {
                                    console.error('File path error:', err);
                                    res.status(400).send({ error: 1, msg: err.message });
                                }
                            }
                            else if (request.query.ChartTypeID == '2') {
                                const wb = XLSX.utils.book_new();
                                var currentDate = new Date();
                                const timestamp = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}_${d.getHours()}_${d.getMinutes()}`;
                                for (let i = 0; i < recordsets.recordsets[0].length; i++) {
                                    var dataArr1 = [];
                                    var dataArr2 = [];
                                    for (let j = 0; j < recordsets.recordsets[1].length; j++) {
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
                                    var sheetName = recordsets.recordsets[0][i]['CharacteristicName']
                                    XLSX.utils.book_append_sheet(wb, ws, sheetName)
                                }
                                try {
                                    const fileName = `MesXbarChartData_${timestamp}.xlsx`;
                                    const safePath = getSafeFilePath(fileName);
                                    XLSX.writeFile(wb, safePath);

                                    res.download(safePath, fileName, {
                                        headers: {
                                            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                        }
                                    });
                                } catch (err) {
                                    console.error('File path error:', err);
                                    res.status(400).send({ error: 1, msg: err.message });
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