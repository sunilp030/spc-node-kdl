var config = require("../config/db.config");
const sql = require("mssql");

//get Management List........................
exports.getManagementList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("ActionID", request.query.ActionId);
            req.input("OperationLineId", request.query.OperationLineId);
            req.input("StationId", request.query.StationId);
            req.input("TemplateId", request.query.TemplateId);
            req.input("MachineId", request.query.MachineId);
            req.input("CharacteristicsIds", request.query.CharacteristicsId);
            req.input("FromDate", request.query.FromDate);
            req.input("ToDate", request.query.ToDate);
            req.output('errormsg', sql.VarChar(sql.MAX));
   
            req.execute("Sp_getDataManagementData", function(err, recordsets, returnValue) {
                if (err) res.send(err)
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

    //Handle connection errors
    .catch(function(err) {
        conn.close();
    });

}
//get Management Details.....................
exports.getManagementDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("management_id", request.query.management_id);

            req.execute("sp_GetManagementDetails", function(err, recordsets, returnValue) {
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
//delete Management.........................
exports.deleteManagement = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            var column = new sql.Table();
            req.input("Login_id", request.body.Login_id);
         
            
            // column.columns.add('SrNo', sql.BigInt);
            column.columns.add('DataHdrID', sql.Int);
            // column.columns.add('SerialNo', sql.Int);
            // column.columns.add('DateTime', sql.SmallDateTime);
            // column.columns.add('SPCStation', sql.VarChar(100));
            // column.columns.add('Template', sql.NVarChar(100));
            // column.columns.add('CharacterID',  sql.Int);
            // column.columns.add('Characteristic',  sql.VarChar(100));
            // column.columns.add('Machine', sql.VarChar(100));
            // column.columns.add('Pallete', sql.NChar(10));
            // column.columns.add('PartNo', sql.NVarChar(50));
            // column.columns.add('Reading', sql.Decimal(18,5));
            // column.columns.add('Event', sql.NVarChar(100));
            // column.columns.add('Operator', sql.VarChar(50));
            // column.columns.add('Shifts', sql.VarChar(10));

            var charList = request.body.charList;
            charList.forEach(element => {
                column.rows.add(element.DataHdrID);
                // column.rows.add(element.SrNo, element.DataHdrID, element.SerialNo,
                //      element.DateTime, element.SPCStation, element.Template,element.CharacterID,
                //     element.Characteristic, element.Machine,  element.Pallete,
                //      element.PartNo, element.Reading, element.Event,  element.Operator,
                //       element.Shifts);
            });
            req.input('udtDataManagementToDelete', column);
 
            req.execute('Sp_DeleteDataManagementData', function(err, recordsets, returnValue) {
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

