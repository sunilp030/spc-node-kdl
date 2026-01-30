var config = require("../config/db.config");
const sql = require("mssql");
const { request } = require("express");
const date = require('date-and-time');

//get shift List.............................
exports.getShiftList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {

            var req = new sql.Request(conn);
            req.input("Login_Id", request.body.Login_Id);
            req.input("Search", request.query.Search);

            req.execute("sp_GetShiftList", function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != "") {
                        res.send(200, {
                            "error": 1,
                            "msg": recordsets.output.error_msg
                        })
                    }
                    else {
                        res.send({
                            "error": 0,
                            "data": recordsets.recordset
                        }, 200)
                    }
            })
        })

        //  Handle connection error
        .catch(function (err) {
            conn.close();
        });
}
// insert Shift..............................
exports.insertShift = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            var column = new sql.Table();
            var column2 = new sql.Table();

            req.input("Login_id", request.body.Login_id);
            req.input("StartDate", request.body.StartDate);
            req.input("created_version", request.body.created_version);
            req.output('errormsg', sql.VarChar(sql.MAX));


            column.columns.add('ShiftID', sql.Int)
            column.columns.add('ShiftName', sql.VarChar(20));
            column.columns.add('ShiftStart', sql.NVarChar(5));
            column.columns.add('ShiftEnd', sql.NVarChar(5));
                column2.columns.add('SubGroup', sql.Int)
                column2.columns.add('Shift', sql.Int)
                column2.columns.add('Interval', sql.Int)
                column2.columns.add('IntervalStart', sql.VarChar(5));
                column2.columns.add('IntervalEnd', sql.VarChar(5));
                column2.columns.add('ShiftSetID', sql.Int);
       
        
            var list = request.body.udtshifts;
            list.forEach(element => {
                column.rows.add(element.ShiftID, element.ShiftName, element.ShiftStart, element.ShiftEnd);
            });

            var list2 = request.body.udtshiftAdvdetail;
            list2.forEach(element => {
                column2.rows.add(element.SubGroup, element.Shift, element.Interval, element.IntervalStart, element.IntervalEnd, element.ShiftSetID);
            });

            req.input("udtshifts", column);
            req.input("udtshiftAdvdetail", column2);
          
            req.execute('sp_InsertShift', function (err, recordsets, returnValue) {
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
//get Shift Default Details.....................
exports.getShiftDefaultDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
          
            req.execute('sp_GetDefaultShiftDetail', function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != '') {
                        res.send(200, {
                            'error': 1,
                            "msg": recordsets.output.error_msg
                        })
                    }
                    else {
                        var header = {};
                        if (recordsets != null) {
                            var shift = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[0] : null;
                            header.shift = shift;
                            var shiftAdvance = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[1] : [];
                            if (header != null) {
                                header.shiftAdvance = shiftAdvance;
                            }
                            else {
                                console.log("");
                            }
                            res.send({
                                'error': 0,
                                'data': header
                            }, 200)
                        }

                    }
            });
        })

        // handle connection error
        .catch(function (err) {
            conn.close();
        })
}
//get Shift Details.............................
exports.getShiftDetails = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input("ShiftSetID", request.query.ShiftSetID);

            req.execute('sp_GetShiftDetail', function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null && recordsets.output.error_msg != '') {
                        res.send(200, {
                            'error': 1,
                            "msg": recordsets.output.error_msg
                        })
                    }
                    else {
                        var header = {};
                        if (recordsets != null) {
                            var shift = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[1] : null;
                            header.shift = shift;
                            var shiftAdvance = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[2] : [];
                            if (header != null) {
                                header.shiftAdvance = shiftAdvance;
                            }
                            else {
                                console.log("");
                            }
                            var startDate = recordsets.recordsets != null && recordsets.recordsets.length > 0 ? recordsets.recordsets[0] : null;
                            header.startDate = startDate;
                            res.send({
                                'error': 0,
                                'data': header
                            }, 200)
                        }
                    }
            });
        })

        // handle connection error
        .catch(function (err) {
            conn.close();
        })
}
//update Shift..................................
exports.updateShift = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            var column = new sql.Table();
            var column2 = new sql.Table();

            req.input("Login_id", request.body.Login_id);
            req.input("ShiftSetID", request.body.ShiftSetID);
            req.input("Modified_Version", request.body.Modified_Version);

            column2.columns.add('SubGroup', sql.Int)
                column2.columns.add('Shift', sql.Int)
                column2.columns.add('Interval', sql.Int)
                column2.columns.add('IntervalStart', sql.VarChar(5));
                column2.columns.add('IntervalEnd', sql.VarChar(5));
                column2.columns.add('ShiftSetID', sql.Int);
            

                var list2 = request.body.udtshiftAdvdetail;
                list2.forEach(element => {
                    column2.rows.add(element.SubGroup, element.Shift, element.Interval, element.IntervalStart, element.IntervalEnd, element.ShiftSetID);
                });
                req.input("udtshiftAdvdetail", column2);

            req.execute('sp_UpdateShift', function (err, recordsets, returnValue) {
                if (err) res.send(err)
                else
                    if (recordsets.output != null && recordsets.error_msg != null && recordsets.error_msg != '') {
                        res.send(200, {
                            'error': 1,
                            'msg': recordsets.output.error_msg
                        });
                    } else {
                        res.send({
                            'error': 0,
                            'msg': recordsets.recordset
                        }, 200)
                    }
            });
        })

        // Handle connection error
        .catch(function (err) {
            conn.close();
        })
}
// delete Shift ................................
exports.deleteShift = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function () {
            var req = new sql.Request(conn);
            req.input("Login_Id", request.query.Login_Id);
            req.input('Shift_id', request.query.shift_id);
            req.input('Deleted_Version', request.query.Deleted_Version);

            req.execute('sp_DeletedShift', function (err, recordsets, returnValue) {
                if (err) res.send(res);
                else
                    if (recordsets.output != null && recordsets.output.error_msg != null & recordsets.output.error_msg != '') {
                        res.send(200, {
                            'error': 1,
                            'msg': recordsets.output.error_msg
                        })
                    }
                    else {
                        res.send({
                            'error': 0,
                            'data': recordsets.recordset
                        }, 200)
                    }
            });
        })

        // Handle connection error
        .catch(function () {
            conn.close();
        });
}
//validate date & convert..................................
convertData = (time) => {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(time - tzoffset)).toISOString().slice(0, 19).replace('T', '');
    var mySqlDT = localISOTime;
    return mySqlDT;
}