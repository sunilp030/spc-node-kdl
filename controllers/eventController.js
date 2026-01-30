var config = require("../config/db.config");
const sql = require("mssql");

//get event List....................
exports.getEventList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Search", request.query.Search);
            req.execute("sp_GetEventList", function(err, recordsets, returnValue) {
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
//insert Event..............................
exports.insertEvent = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            
            req.input("Login_id", request.body.Login_id);
            req.input("Event_Code", request.body.Event_Code );
            req.input("Event_name", request.body.Event_name );
            req.input("NoOfReading", request.body.NoOfReading );
            req.input("ApplyToAll", request.body.ApplyToAll );
            req.input("created_version", request.body.created_version );
			req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute('sp_InsertEvent', function(err, recordsets, returnValue) {
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
//get Event Details........................
exports.getEventDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("Event_id", request.query.Event_id);

            req.execute("sp_GetEventDetails", function(err, recordsets, returnValue) {
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
//update Event.............................
exports.updateEvent = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);

            req.input("Login_id", request.body.Login_id);
            req.input("EventID", request.body.EventID );
            req.input("Event_Code", request.body.Event_Code );
            req.input("Event_name", request.body.Event_name );
            req.input("NoOfReading", request.body.NoOfReading );
            req.input("ApplyToAll", request.body.ApplyToAll );
            req.input("Modified_version", request.body.Modified_Version );
            req.output('errormsg', sql.VarChar(sql.MAX))

            req.execute("sp_UpdateEvent", function(err, recordsets, returnValue) {
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
//delete station..........................
exports.deleteEvent = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
    .then(function() {
        var req = new sql.Request(conn);

        req.input("Login_id", request.query.Login_id);
        req.input("Event_id", request.query.event_id);
        req.input("Deleted_Version", request.query.Deleted_Version);


        req.execute("spDeleteEvent", function(err, recordsets, returnValue) {
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

