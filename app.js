const express = require("express");
const cors = require("cors");
// var bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 9000;
// app.use('port', port);

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));
// app.use(bodyParser.json({limit: "300mb"}));
// app.use(bodyParser.urlencoded({limit: "300mb", extended: true, parameterLimit: 50000000}));
// app.use(express.bodyParser({limit: '100mb'}));
app.use(cors({credentials: true, origin: true}));
app.options('*', cors());
var cron = require('node-cron');
const request = require('request');
app.use(express.json());

const userRouter = require("./routes/userRoute");
const roleRouter = require("./routes/roleRoute");
const stationRouter = require("./routes/stationRoute");
const machineRouter = require("./routes/machineRoute");
const eventRouter = require("./routes/eventRoute");
const authRouter = require("./routes/authRoute");
const operationalRouter = require("./routes/operationalRoute");
const templateRouter = require("./routes/templateRoute");
const utilRouter = require("./routes/utilRoute");
const shiftRouter = require("./routes/shiftRoute");
const chartRouter = require("./routes/chartRoute");
const modifyRouter = require("./routes/modifyRoute");
const managementRouter = require("./routes/managementRoute");
const mesRouter = require("./routes/mesRoute");
const backupRouter = require("./routes/backupRoute");





app.set('view engine', 'pug')

//added feedback operations router
// app.use("/feedback", feedbackRouter);
// For the time now
Date.prototype.timeNow = function() {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}


//added email operations router
app.use("/auth", authRouter);
app.use("/common", utilRouter);
app.use("/user", userRouter);
app.use("/role", roleRouter);
app.use("/operation", operationalRouter);
app.use("/station", stationRouter);
app.use("/machine", machineRouter);
app.use("/event", eventRouter);
app.use("/template", templateRouter);
app.use("/shift",shiftRouter);
app.use("/chart", chartRouter);
app.use("/modify", modifyRouter);
app.use("/management", managementRouter);
app.use("/mes", mesRouter);
app.use("/backup", backupRouter);

// cron.schedule(`*/2 * * * *`, () => {
//     console.log('running a task 5 minute minute');
//     console.log(new Date().timeNow());
//     request('http://localhost:9000/email/details', function(error, response, body) {
//         console.error('error:', error); // Print the error if one occurred
//         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//         console.log('body:', body); // Print the HTML for the Google homepage.
//     });
// });


app.listen(port, () => console.log(`The app is running on Port: ${port}.`));