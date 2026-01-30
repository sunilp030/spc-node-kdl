var config = require("../config/db.config");
const sql = require("mssql");

//get modify List............................
exports.getModifyList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Search", request.query.Search);

            req.execute("sp_GetModifyList", function (err, recordsets, returnValue) {
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
//insert Modify..............................
exports.insertModify = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_id", request.body.Login_id);
            req.input("modify_no", request.body.modify_no);
            req.input("modify_name", request.body.modify_name);
            req.input("station_id", request.body.station_id);
            req.input("created_version", request.body.created_version);
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute('sp_InsertModify', function (err, recordsets, returnValue) {
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
        .catch(function (err) {
            conn.close();
        });
}
//get Modify Details.........................
exports.getModifyDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("modify_id", request.query.modify_id);

            req.execute("sp_GetModifyDetails", function (err, recordsets, returnValue) {
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
//update Modify...............................
exports.updateModify = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_id", request.body.Login_id);
            req.input("SrNo", request.body.SrNo );
            req.input("DataHdrID", request.body.DataHdrID );
            req.input("SerialNo", request.body.SerialNo );
            req.input("DateTime", request.body.DateTime );
            req.input("SPCStation", request.body.SPCStation );
            req.input("Template", request.body.Template );
            req.input("Characteristic", request.body.Characteristic );
            req.input("Machine", request.body.Machine );
            req.input("Pallete", request.body.Pallete );
            req.input("PartNo", request.body.PartNo );
            req.input("Reading", request.body.Reading );
            req.input("Event", request.body.Event );
            req.input("Operator", request.body.Operator );
            req.input("Shifts", request.body.Shifts );
         
            req.execute("Sp_UpdateDataManagementData", function (err, recordsets, returnValue) {
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
                            "data": recordsets.recordset
                        }, 200)
                    }
            })

        })
        //Handle connection error
        .catch(function (err) {
            conn.close();
        });
}


