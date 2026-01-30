var config = require("../config/db.config");
const sql = require("mssql");

//get machine List.............................
exports.getMachineList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Search", request.query.Search);

            req.execute("sp_GetMachineList", function(err, recordsets, returnValue) {
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
//insert Machine................................
exports.insertMachine = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            var column = new sql.Table();

            column.columns.add('ID', sql.Char(2));
            column.columns.add('Name', sql.Int);
            column.columns.add('dotsRequired', sql.Int);
            column.columns.add('OpType', sql.Char(1));

            var palletList = request.body.palletList;
            palletList.forEach(element => {
                column.rows.add(element.ID,element.Name, element.dotsRequired,element.OpType);
            });

            req.input("Login_id", request.body.Login_id);
            req.input("machine_no", request.body.machine_no );
            req.input("machine_name", request.body.machine_name );
            req.input("station_id", request.body.station_id );
            req.input("created_version", request.body.created_version );
		    req.output('errormsg', sql.VarChar(sql.MAX))

            req.input('udtMachinePalleteConf', column);

            req.execute('sp_InsertMachine', function(err, recordsets, returnValue) {
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
//get Machine Details...........................
exports.getMachineDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("machine_id", request.query.machine_id);

            req.execute("sp_GetMachineDetails", function(err, recordsets, returnValue) {
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
//update Machine................................
exports.updateMachine = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            var column = new sql.Table();
            column.columns.add('ID', sql.Char(2));
            column.columns.add('Name', sql.Int);
            column.columns.add('dotsRequired', sql.Int);
            column.columns.add('OpType', sql.Char(1));

            var palletList = request.body.palletList;
            palletList.forEach(element => {
                column.rows.add(element.ID,element.Name, element.dotsRequired,element.OpType);
            });

            req.input("Login_id", request.body.Login_id);
            req.input("machine_id", request.body.machine_id );
            req.input("machine_no", request.body.machine_no );
            req.input("machine_name", request.body.machine_name );
            req.input("station_id", request.body.station_id );
            req.input("Modified_Version", request.body.Modified_Version );
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.input('udtMachinePalleteConf', column);
            req.execute("sp_UpdateMachine", function(err, recordsets, returnValue) {
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
//delete machine................................
exports.deleteMachine = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
    .then(function() {
        var req = new sql.Request(conn);

        req.input("Login_id", request.query.Login_id);
        req.input("machine_id", request.query.machine_id);
        req.input("Deleted_Version", request.query.Deleted_Version);
        req.output('errormsg', sql.VarChar(sql.MAX))

        req.execute("spDeleteMachine", function(err, recordsets, returnValue) {
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

