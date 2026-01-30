var config = require("../config/db.config");
const sql = require("mssql");

//get station List...............................
exports.getSpcStationList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Search", request.query.Search);

            req.execute("sp_GetSPCStationList", function(err, recordsets, returnValue) {
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
//insert Spc Station............................
exports.insertSpcStation = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            
            req.input("Login_id", request.body.Login_id);
            req.input("station_No", request.body.station_No );
            req.input("station_Name", request.body.station_Name );
            req.input("OperationLineID", request.body.OperationLineID );
            req.input("created_version", request.body.created_version );
			req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute('sp_InsertSPCStation', function(err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                if (recordsets.output != null && recordsets.output.errormsg != null && recordsets.output.errormsg != '') {
                    res.send(200, {
                        "error": 1,
                        "msg": recordsets.output.errormsg
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
//get SpcStation Details.........................
exports.getSpcStationDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {

            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Station_Id", request.query.Station_Id);

            req.execute("sp_GetSPCStationDetails", function(err, recordsets, returnValue) {
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
//update SpcStation..............................
exports.updateSpcStation = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);

            req.input("Login_id", request.body.Login_id);
            req.input("station_id", request.body.station_id );
            req.input("station_No", request.body.station_No );
            req.input("station_Name", request.body.station_Name );
            req.input("OperationLineID", request.body.OperationLineID);
            req.input("MacAddress", request.body.MacAddress );
            req.input("Modified_Version", request.body.Modified_Version );
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute("sp_UpdateSPCStation", function(err, recordsets, returnValue) {
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
        .catch(function(err) {
            conn.close();
        });
}
//delete station...............................
exports.deleteSpcStation = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);

        req.input("Login_Id", request.query.Login_Id);
        req.input("Station_Id", request.query.Station_Id);
        req.input("Deleted_Version", request.query.Deleted_Version);
        req.output('errormsg', sql.VarChar(sql.MAX))

        req.execute("sp_DeleteSPCStation", function(err, recordsets, returnValue) {
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

    //handle connection errors
    .catch(function(err) {
        conn.close();
    });
}

