var config = require("../config/db.config");
const sql = require("mssql");


//verify user while login............................
exports.verifyUser = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);
        req.input("username", request.body.username);
        req.input("password", request.body.password);
        req.output('error_msg', sql.VarChar(sql.MAX))

        req.execute("validate_user", function(err, recordsets, returnValue) {
            if (err) res.send(err)
            else
            if (recordsets.output != null && recordsets.output.errormsg != null && recordsets.output.errormsg != "") {
                res.send(200, {
                    "error": 1,
                    "msg": recordsets.output.errormsg
                })
            } else {
                res.send({
                    "errror": 0,
                    "msg": recordsets.recordset
                })
            }
        })

    })

    //Handle  connection error
    .catch(function(error) {
        conn.close();
    });
}
//get user List......................................
exports.getUserList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Search", request.query.Search);
       
            req.execute("sp_GetUserList", function(err, recordsets, returnValue) {
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
//get Defaultuser List..............................
exports.getDefaultUser = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
    
            req.execute("sp_GetDefaultUser", function(err, recordsets, returnValue) {
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
//get user Details .............................
exports.getUserDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("user_id", request.query.user_id);

            req.execute("sp_GetUserDetails", function(err, recordsets, returnValue) {
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
                        var userAccess = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[1] : [];
                        if (header != null)
                            header.userAccess = userAccess;
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
//delete user..................................
exports.deleteUser = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);
        req.input("Login_id", request.query.Login_Id);
        req.input("user_id", request.query.user_id);
        req.input("Deleted_Version", request.query.Deleted_Version);

        req.execute("sp_DeleteUser", function(err, recordsets, returnValue) {
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
//update user..................................
exports.updateUser = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            var column = new sql.Table();
            column.columns.add('OFlag', sql.Bit);
            column.columns.add('OperationLineID', sql.Int);
            column.columns.add('OperationLineName', sql.VarChar(100));
            column.columns.add('STFlag', sql.Bit);
            column.columns.add('StationID', sql.Int);
            column.columns.add('StationName', sql.VarChar(100));
           
            var userAccess = request.body.userAccessData;
            userAccess.forEach(element => {
                column.rows.add(element.OFlag, element.OperationLineID, element.OperationLineName, element.STFlag,
                 element.StationID, element.StationName);
            });

            req.input("Login_Id", request.body.Login_Id);
            req.input("user_id", request.body.user_id);
            req.input("Name", request.body.Name);
            req.input("UserName", request.body.UserName);
            req.input("role_id", request.body.RoleID);
            req.input("modify_Version", request.body.ModifyVersion );
            req.input('udtuserAccess', column);
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute("sp_Updateuser", function(err, recordsets, returnValue) {
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
//insert User..................................
exports.insertUser= (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            var column = new sql.Table();
            column.columns.add('OFlag', sql.Bit);
            column.columns.add('OperationLineID', sql.Int);
            column.columns.add('OperationLineName', sql.VarChar(100));
            column.columns.add('STFlag', sql.Bit);
            column.columns.add('StationID', sql.Int);
            column.columns.add('StationName', sql.VarChar(100));
        
            var userAccess = request.body.userAccessData;
            userAccess.forEach(element => {
                column.rows.add(element.OFlag, element.OperationLineID, element.OperationLineName, element.STFlag,
                 element.StationID, element.StationName);
            });

            req.input("Login_Id", request.body.Login_Id);
            req.input("Name", request.body.Name);
            req.input("UserName", request.body.UserName);
            req.input("password", request.body.password);
            req.input("RoleID", request.body.RoleID);
            req.input("CreatedVersion", request.body.CreatedVersion );
            req.input('udtuserAccess', column);
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute('sp_InsertUser', function(err, recordsets, returnValue) {
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

