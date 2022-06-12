require("dotenv").config();

const cors = require("cors");
const dbo = require("./db/connection");
const express = require("express");
const apiRoutes = require("./routes/api");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

const port = process.env.PORT || 3000;
const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(apiRoutes);

app.use("/encode/uploads/", express.static("encode/uploads"));
app.use("/encode/results/", express.static("encode/results"));

app.use("/decode/uploads/", express.static("decode/uploads"));
app.use("/decode/results/", express.static("decode/results"));

app.use(function (err, _req, res) {
  console.error(err.stack);
  res.send({
    status: false,
    error: err,
  });
});

dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
