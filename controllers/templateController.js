var config = require("../config/db.config");
const sql = require("mssql");

//get template List.............................
exports.getTemplateList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);

            req.execute("sp_GetTemplateList", function(err, recordsets, returnValue) {
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
    .catch(function(err) {
        conn.close();
    });

}
//insert Template...............................
exports.insertTemplate = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            request.socket.setTimeout(5 * 60 * 1000);
            var req = new sql.Request(conn);
            var column = new sql.Table();
            var column2 = new sql.Table();

            req.input("Login_id", request.body.Login_id);
            req.input("Template_Name", request.body.Template_Name );
            req.input("StationID", request.body.StationID );
            req.input("Template_Description", request.body.Template_Description);
            req.input("ModelNo", request.body.ModelNo);
            req.input("ControlChartDisplayOptionID", request.body.ControlChartDisplayOptionID);
            req.input("ControlChartDisplayOptionValue", request.body.ControlChartDisplayOptionValue );
            req.input("IsTemplateFreq", request.body.IsTemplateFreq);
            req.input("IsMachineFreq", request.body.IsMachineFreq);
            req.input("IsPalletFreq", request.body.IsPalletFreq);
            req.input("NoOfMonthForCL", request.body.NoOfMonthForCL);
            req.input("created_version", request.body.created_version);  
            req.input("BarcodeToUsed", request.body.BarcodeToUsed);          

            column.columns.add('CharacteristicID', sql.Int);
            column.columns.add('CFlag', sql.Int);
            column.columns.add('SrNo', sql.Int);
            column.columns.add('CharacteristicName', sql.VarChar(100));
            column.columns.add('CharacteristicsTypeID', sql.Int);
            column.columns.add('CharacteristicType', sql.VarChar(100));
            column.columns.add('UnitID', sql.Int);
            column.columns.add('Unit', sql.VarChar(100));
            column.columns.add('USL', sql.Decimal(18,6));
            column.columns.add('LSL', sql.Decimal(18,6));
            column.columns.add('Mean', sql.Decimal(18,6));
            column.columns.add('UPCL', sql.Decimal(18,6));
            column.columns.add('LPCL', sql.Decimal(18,6));
            column.columns.add('MasterSize', sql.Decimal(18,6));
            column.columns.add('GaugeSourceID', sql.Int);
            column.columns.add('GaugeSource', sql.VarChar(50));
            column.columns.add('Frequency', sql.Int);
            column.columns.add('Attachement', sql.VarChar(sql.MAX));
            column.columns.add('formula', sql.Int);
            column.columns.add('is_golden_rule', sql.Bit);
            column.columns.add('Golden_Rule', sql.VarChar(100));

            var charList = request.body.charList;
            charList.forEach(element => {
                column.rows.add(element.CharacteristicID,element.CFlag, element.SrNo, element.CharacteristicName, parseInt(element.CharacteristicsTypeID), element.CharacteristicType, element.UnitID,
                    element.Unit, element.USL,  element.LSL, element.Mean, element.UPCL != '' ?  element.UPCL : 0,
                    element.LPCL != '' ?  element.LPCL : 0,element.MasterSize != '' ?  element.MasterSize : 0, 
                    element.GaugeSourceID != '' ? element.GaugeSourceID : 0, element.GaugeSource, element.Frequency, 
                    element.Attachement,element.formula, element.is_golden_rule, 
                    element.Golden_Rule
                    );
            });
            req.input('udtTemplateCharacteristic', column);

            column2.columns.add('Model', sql.VarChar(50));
            column2.columns.add('ModelType', sql.Char(1));
            var modelList = request.body.Model;
            modelList.forEach(element => {
                column2.rows.add(element.Model,element.ModelType);
            });
            req.input('udtTemplateModel', column2);
            req.output('errormsg', sql.VarChar(sql.MAX));

            req.execute('sp_InsertTemplate', function(err, recordsets, returnValue) {
              
                if (err) res.send(err)
                else
                if (recordsets.output != null && recordsets.output.errormsg != null && recordsets.output.errormsg != '') {
                    res.send(200, {
                        "error": 1,
                        "msg": recordsets.output.errormsg,
                    })
                } else {

                    res.send({
                        "error": 0,
                        "data": recordsets.recordset,
                    }, 200)
                }

            });
        })
        // Handle connection errors
        .catch(function(err) {
            conn.close();
        });
}
//insert Gauge..................................
exports.insertGauge = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);

            req.input("Login_id", request.body.Login_id);
            req.input("Gauge_Name", request.body.Gauge_Name );
            req.input("Make", request.body.Make );
            // req.input("PortNo", request.body.PortNo);
            // req.input("Channel_No", request.body.Channel_No);
            req.input("UwaveRNo", request.body.uwaver);
            req.input("GroupID", request.body.group_id);
            req.input("ChannelNo", request.body.Channel_No);
            req.input("StationID", request.body.StationID);
            req.input("created_version", request.body.created_version);           
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute('sp_InsertGaugeSource', function(err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                if (recordsets.output != null && recordsets.output.errormsg != null && recordsets.output.errormsg != '') {
                    res.send(200, {
                        "error": 1,
                        "msg": recordsets.output.errormsg,
                    })
                } else {

                    res.send({
                        "error": 0,
                        "data": recordsets.recordset,
                    }, 200)
                }

            });
        })
        // Handle connection errors
        .catch(function(err) {
            conn.close();
        });
}
//get GaugeSource Details........................
exports.getGaugeSourceDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_id", request.query.Login_id);
            req.input("GaugeSourceID", request.query.GaugeSourceID);

            req.execute("sp_GetGaugeSourceDetail", function(err, recordsets, returnValue) {
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
    .catch(function(err) {
        conn.close();
    });

}
//delete gauge source...........................
exports.deleteGaugeSource = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
    .then(function() {
        var req = new sql.Request(conn);
        req.input("Login_id", request.query.Login_id);
        req.input("GaugeSourceID", request.query.GaugeSourceID);
        req.input("Deleted_version", request.query.Deleted_version);
        req.output('ErrorMsg', sql.VarChar(sql.MAX))

        req.execute("sp_DeleteGaugeSource", function(err, recordsets, returnValue) {
            if (err) res.send(err)
            else
            if (recordsets.output != null && recordsets.output.ErrorMsg != null && recordsets.output.ErrorMsg != "") {
                res.send(200, {
                    "error": 1,
                    "msg": recordsets.output.ErrorMsg
                })
            } else {
                res.send({
                    "error": 0,
                    "data": recordsets.recordset
                }, 200)
            }
        })
    })

    //handle connection errors
    .catch(function(err) {
        conn.close();
    });
}
//update gauge...................................
exports.updateGauge= (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_id", request.body.Login_id);
            req.input("GaugeSourceID", request.body.GaugeSourceID);
            req.input("Gauge_Name", request.body.Gauge_Name);
            req.input("Make", request.body.Make);
            // req.input("PortNo", request.body.PortNo);
            // req.input("Channel_No", request.body.Channel_No);
            req.input("UwaveRNo", request.body.uwaver);
            req.input("GroupID", request.body.group_id);
            req.input("ChannelNo", request.body.Channel_No);
            req.input("StationID", request.body.StationID);
            req.input("Modified_version", request.body.Modified_version); 
            req.output('errormsg', sql.VarChar(sql.MAX))                      
    
            req.execute("sp_UpdateGaugeSource", function(err, recordsets, returnValue) {
                if (err){
                    res.send(err);
                }
                else
                if (recordsets.output != null && recordsets.output.errormsg != null && recordsets.output.errormsg != "") {
                    res.send(200, {
                        "error": 1,
                        "msg": recordsets.output.errormsg
                    })
                } else {
                    res.send({
                        "error": 0,
                        "data": recordsets.recordset
                    }, 200)
                }
            })

        })
        //Handle connection error
        .catch(function(err) {
            conn.close();
        });
}
//get Template Details...........................
exports.getTemplateDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Template_Id", request.query.Template_id);

            req.execute("sp_GetTemplateDetails", function(err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != "") {
                    res.send(200, {
                        "error": 1,
                        "msg": recordsets.output.error_msg
                    })
                } else {
                    console.log('data : ',recordsets.recordsets);
                    var header;
                    if (recordsets != null) {
                        header = recordsets.recordsets != null && recordsets.recordsets[0].length > 0 ? recordsets.recordsets[0][0] : null;
                        var character = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[1] : [];
                        var modelNoList = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[2] : [];
                        if (header != null)
                            header.character = character;
                            header.model = modelNoList;
                    } else {
                        console.log("null");
                    }
                    res.send({
                        "error": 0,
                        "data": header
                    }, 200)
                }
            })
        })

    //Handle connection errors
    .catch(function(err) {
        conn.close();
    });

}
//update Template................................
exports.updateTemplate = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        //successfull connection
        .then(function() {
            var req = new sql.Request(conn);
            console.log('abc..........');
            request.socket.setTimeout(5 * 60 * 1000);
            console.log('abc2..........');
            var udtTemplateCharacteristic = new sql.Table();
            var column2 = new sql.Table();

            req.input("Login_id", request.body.Login_id);
            req.input("TemplateID", request.body.Template_Code );
            req.input("Template_Name", request.body.Template_Name );
            req.input("StationID", request.body.StationID );
            req.input("Template_Description", request.body.Template_Description);
            req.input("ModelNo", request.body.ModelNo);
            req.input("ControlChartDisplayOptionID", request.body.ControlChartDisplayOptionID);
            req.input("ControlChartDisplayOptionValue", request.body.ControlChartDisplayOptionValue );
            req.input("IsTemplateFreq", request.body.IsTemplateFreq);
            req.input("IsMachineFreq", request.body.IsMachineFreq);
            req.input("IsPalletFreq", request.body.IsPalletFreq);
            req.input("NoOfMonthForCL", request.body.NoOfMonthForCL);
            req.input("modified_version", request.body.modified_version);           
            req.input("BarcodeToUsed", request.body.BarcodeToUsed);           
            
            udtTemplateCharacteristic.columns.add('CharacteristicID', sql.Int);
            udtTemplateCharacteristic.columns.add('CFlag', sql.Int);
            udtTemplateCharacteristic.columns.add('SrNo', sql.Int);
            udtTemplateCharacteristic.columns.add('CharacteristicName', sql.VarChar(100));
            udtTemplateCharacteristic.columns.add('CharacteristicsTypeID', sql.Int);
            udtTemplateCharacteristic.columns.add('CharacteristicType', sql.VarChar(100));
            udtTemplateCharacteristic.columns.add('UnitID', sql.Int);
            udtTemplateCharacteristic.columns.add('Unit', sql.VarChar(100));
            udtTemplateCharacteristic.columns.add('USL', sql.Decimal(18,6));
            udtTemplateCharacteristic.columns.add('LSL', sql.Decimal(18,6));
            udtTemplateCharacteristic.columns.add('Mean', sql.Decimal(18,6));
            udtTemplateCharacteristic.columns.add('UPCL', sql.Decimal(18,6));
            udtTemplateCharacteristic.columns.add('LPCL', sql.Decimal(18,6));
            udtTemplateCharacteristic.columns.add('MasterSize', sql.Decimal(18,6));
            udtTemplateCharacteristic.columns.add('GaugeSourceID', sql.Int);
            udtTemplateCharacteristic.columns.add('GaugeSource', sql.VarChar(50));
            udtTemplateCharacteristic.columns.add('Frequency', sql.Int);
            udtTemplateCharacteristic.columns.add('Attachement', sql.VarChar(sql.MAX));
            udtTemplateCharacteristic.columns.add('formula', sql.Int);
            udtTemplateCharacteristic.columns.add('is_golden_rule', sql.Bit);
            udtTemplateCharacteristic.columns.add('Golden_Rule', sql.VarChar(100));
           

            var list = request.body.charList;
            console.log("charList", request.body.charList )
             list.forEach(element => {
                udtTemplateCharacteristic.rows.add(element.CharacteristicID,element.CFlag, element.SrNo,element.CharacteristicName, element.CharacteristicsTypeID, element.CharacteristicType, 
                    element.UnitID, element.Unit,element.USL, element.LSL,element.Mean, element.UPCL != '' ?  element.UPCL : 0,
                    element.LPCL != '' ?  element.LPCL : 0, 
                    element.MasterSize != '' ?  element.MasterSize : 0, 
                    element.GaugeSourceID != '' ? element.GaugeSourceID : 0,
                     element.GaugeSource, element.Frequency, 
                      element.Attachement,element.formula,element.is_golden_rule, element.Golden_Rule != [] ? element.Golden_Rule : '' );
            });

            req.input("udtTemplateCharacteristic", udtTemplateCharacteristic );
            console.log(udtTemplateCharacteristic)

            column2.columns.add('Model', sql.VarChar(50));
            column2.columns.add('ModelType', sql.Char(1));
            var modelList = request.body.Model;
            modelList.forEach(element => {
                column2.rows.add(element.Model,element.ModelType);
            });
            req.input('udtTemplateModel', column2);

            req.output('errormsg', sql.VarChar(sql.MAX));

            req.execute("sp_UpdateTemplate", function(err, recordsets, returnValue) {

                if (err){
                    console.log('error ',err)
                    res.send(err);
                }
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
        .catch(function(err) {
            conn.close();
        });
}
//delete templete....................
exports.deleteTemplate = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);

        req.input("Login_id", request.query.Login_id);
        req.input("Template_id", request.query.template_id);
        req.input("Deleted_Version", request.query.Deleted_Version);

        req.execute("spDeleteTemplate", function(err, recordsets, returnValue) {
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

    //handle connection errors
    .catch(function(err) {
        conn.close();
    });
}
//get image configuration.............................
exports.getImageConfig = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);

            req.execute("sp_getImageConfig", function(err, recordsets, returnValue) {
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
    .catch(function(err) {
        conn.close();
    });

}

//get golden rule List.............................
exports.getGoldenRuleList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);

            req.execute("sp_GetGolden_Rule", function(err, recordsets, returnValue) {
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
    .catch(function(err) {
        conn.close();
    });

}