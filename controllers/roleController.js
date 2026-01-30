var config = require("../config/db.config");
const sql = require("mssql");

//get role List..............................
exports.getRollList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Search", request.query.Search);

            req.execute("sp_GetRoleList", function(err, recordsets, returnValue) {
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
//get DefaultRole List.......................
exports.getDefaultRole = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("IsOperatorRole", request.query.IsOperatorRole);

            req.execute("sp_GetDefaultRole", function(err, recordsets, returnValue) {
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
//get Role Details...........................
exports.getRoleDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("role_id", request.query.role_id);

            req.execute("sp_GetRoleDetails", function(err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != "") {
                    res.send(200, {
                        "error": 1,
                        "msg": recordsets.output.error_msg
                    })
                } else {
                    var header;
                    if (recordsets != null) {
                        header = recordsets.recordsets != null && recordsets.recordsets[0].length > 0 ? recordsets.recordsets[0][0] : null;
                        var roleAccess = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[1] : [];
                        if (header != null)
                            header.roleAccess = roleAccess;
                    } else {
                        console.log("");
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
//delete Role..............................
exports.deleteRole = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
    .then(function() {
        var req = new sql.Request(conn);

        req.input("Login_id", request.query.Login_Id);
        req.input("role_id", request.query.role_id);
        req.input("Deleted_Version", request.query.Deleted_Version);
        req.output('ErrorMsg', sql.VarChar(sql.MAX));

        req.execute("sp_deleteRole", function(err, recordsets, returnValue) {
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
//update role...............................
exports.updatetRole = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
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
                column.rows.add(element.Module, element.ModuleID, element.ModuleFeature,element.FullControl, element.Read,
                 element.write, element.Delete,
                    element.replicate);
            });

            req.input("Login_Id", request.body.Login_Id);
            req.input("role_id", request.body.role_id);
            req.input("role_name", request.body.role_name);
            req.input("IsOperatorRole", request.body.IsOperatorRole);
            req.input("modify_Version", request.body.ModifiedVersion );
            req.input('udtRoleModuleAccess', column);
            req.output('errormsg', sql.VarChar(sql.MAX));
            
            req.execute("sp_UpdateRole", function(err, recordsets, returnValue) {
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
//insert Role................................
exports.insertRole = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
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
                column.rows.add(element.Module, element.ModuleID, element.ModuleFeature,element.FullControl, element.Read,
                 element.write, element.Delete,
                    element.replicate);
            });

            req.input("Login_Id", request.body.Login_Id);
            req.input("RoleName", request.body.RoleName);
            req.input("IsOperatorRole", request.body.IsOperatorRole);
            req.input("CreatedVersion", request.body.CreatedVersion );
            req.input('udtRoleModuleAccess', column);
            req.output('errormsg', sql.VarChar(sql.MAX));

            req.execute('sp_InsertRole', function(err, recordsets, returnValue) {
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

