const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const colors = require("colors");
const fileupload = require("express-fileupload");
const path = require("path");
const errorHandler = require("./middlewares/error");

// Route files
const dumpstr = require("./routes/dumpstr");
const auths = require("./routes/auths");
const admin = require("./routes/admin");


// *Route files for others
const mergestr = require("./routes/mergestr");
const statstr = require("./routes/statstr");
const qcstr = require("./routes/qcstr");
const comparestr = require("./routes/comparestr");

const { connectDB } = require("./config/db");
const { createDumpSTRWorkers } = require("./workers/dumpstr/main");

//*others
const { createMergeSTRWorkers } = require("./workers/mergestr/main");
const { createStatSTRWorkers } = require("./workers/statstr/main");
const { createQcSTRWorkers } = require("./workers/qcstr/main");
const { createCompareSTRWorkers } = require("./workers/comparestr/main");

// Load env vars

// Connect to database
connectDB();

// create express app
const app = express();

// parse the body of the current HTTP request for application/json and
// application/x-www-form-urlencoded requests,
// and make them available in the req.body
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
//cors
const cors = require('cors')

app.use(cors())
// File uploading
app.use(
  fileupload({
    limits: { fileSize: 300 * 1024 * 1024 },
    useTempFiles: true,
    abortOnLimit: true,
    tempFileDir: path.join(process.env.TR_WORKDIR, "temp"),
  })
);

// Mount routers
app.use("/api/v1/dumpstr", dumpstr);
app.use("/api/v1/auths", auths);
app.use("/api/v1/users", admin);


//*Mount routers for others
app.use("/api/v1/mergestr", mergestr);
app.use("/api/v1/statstr", statstr);
app.use("/api/v1/qcstr", qcstr);
app.use("/api/v1/comparestr", comparestr);


app.use('/api/v1/results/home/dzumi/trFiles', express.static('/home/dzumi/trFiles'));

// error handler
app.use(errorHandler);

createDumpSTRWorkers(1);

//*others
createMergeSTRWorkers(1);
createStatSTRWorkers(1);
createQcSTRWorkers(1);
createCompareSTRWorkers(1);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);



// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  // close server and exit process
  server.close(() => process.exit(1));
});
