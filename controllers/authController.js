var config = require("../config/db.config");
const sql = require("mssql");

//post user
exports.verifyUser = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);
        req.input("Username", request.body.Username);
        req.input("password", request.body.password);
        req.output('error_msg', sql.VarChar(sql.MAX))
       
        req.execute("validate_user", function(err, recordsets, returnValue) {
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
                    console.log("");
                }
                res.send({
                    "error": 0,
                    "data": header
                }, 200)
            }
        })

    })

    //Handle  connection error
    .catch(function(error) {
        conn.close();
    });
}

//change password
exports.changePassword = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);
       
        req.input("Login_Id", request.body.Login_Id);
        req.input("Password", request.body.password);
        // req.output('error_msg', sql.VarChar(sql.MAX))
       
        req.execute("sp_UserChangePassword", function(err, recordsets, returnValue) {
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

    //Handle  connection error
    .catch(function(error) {
        conn.close();
    });
}

