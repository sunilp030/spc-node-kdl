const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
// Use axios instead of node-fetch (recommended)
// const fetch = require('node-fetch'); // if using v2
const axios = require('axios'); // safer modern alternative

const app = express();
app.disable('x-powered-by');

const port = process.env.PORT || 9000;

// Body parsers (secure & non-duplicated)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS (currently open – consider restricting in production)
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        callback(null, true);
    },
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Routes
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

app.set('view engine', 'pug');

app.use("/auth", authRouter);
app.use("/common", utilRouter);
app.use("/user", userRouter);
app.use("/role", roleRouter);
app.use("/operation", operationalRouter);
app.use("/station", stationRouter);
app.use("/machine", machineRouter);
app.use("/event", eventRouter);
app.use("/template", templateRouter);
app.use("/shift", shiftRouter);
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