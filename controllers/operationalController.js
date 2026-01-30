var config = require("../config/db.config");
const sql = require("mssql");

//get Operation line List..........................
exports.getOperationList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Search", request.query.Search);

            req.execute("sp_GetOperationList", function(err, recordsets, returnValue) {
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
//insert Operation line.......................
exports.insertOperation = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_id", request.body.Login_Id);
            req.input("Operation_Name", request.body.Operation_Name);
            req.input("Created_Version", request.body.CreatedVersion);
            req.input("EnableMachinewisepalletmapping", request.body.EnableMachinewisepalletmapping);
            req.input("EnableTemplatewisemodelmapping", request.body.EnableTemplatewisemodelmapping);
            req.input("EnableShiftInfo", request.body.EnableShiftInfo);
			req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute('sp_InsertOperationLine', function(err, recordsets, returnValue) {
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
//get Operation line Details...................
exports.getOperationDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_id", request.query.Login_Id);
            req.input("Operation_line_id", request.query.Operation_line_id);

            req.execute("sp_GetOperationLineDetails", function(err, recordsets, returnValue) {
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
//update operation line .......................
exports.updateOperation = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);

            req.input("Login_id", request.body.Login_id);
            req.input("Operation_line_id", request.body.Operation_line_id);
            req.input("Operation_Name", request.body.Operation_Name);
            req.input("EnableMachinewisepalletmapping", request.body.EnableMachinewisepalletmapping);
            req.input("EnableTemplatewisemodelmapping", request.body.EnableTemplatewisemodelmapping);
            req.input("EnableShiftInfo", request.body.EnableShiftInfo);
            req.input("Modified_Version", request.body.Modified_Version );
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute("sp_UpdateOperationLine", function(err, recordsets, returnValue) {
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
//delete operation line....................
exports.deleteOperation = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);
    
        req.input("Login_id", request.query.Login_id);
        req.input("Operation_line_id", request.query.Operation_line_id);
        req.input("Deleted_Version", request.query.Deleted_Version);
        req.output('errormsg', sql.VarChar(sql.MAX))

        req.execute("spDeleteOperationLine", function(err, recordsets, returnValue) {
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


