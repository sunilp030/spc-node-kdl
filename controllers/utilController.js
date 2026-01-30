var config = require("../config/db.config");
const sql = require("mssql");
var fs = require('fs');

//get user List
exports.getDropdownList = (request, res) => {
    var conn = new sql.ConnectionPool(config);
    conn.connect()
        .then(function() {
            var req = new sql.Request(conn);
            req.input("actionid", request.query.actionid);
            req.input("userId",  request.query.userid);
            req.input("String", (request.query.String != '' && request.query.String != null && request.query.String != undefined) ? request.query.String : null);
            // console.log("userId", request.query.userid);

            req.execute("GetFillCombo", function(err, recordsets, returnValue) {
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
//download user manual..............................
exports.userManualDownload = (request, res) => {
    var fileName = 'SPC_User_Manual_v1.202208.pdf';
    if(fileName != null && fs.existsSync('./user_manual_document/'+fileName)){
        res.download("./user_manual_document/"+fileName)
    }else{
        res.send({
            'error' : 'Unable to download user manual.'
        });
    }
}

