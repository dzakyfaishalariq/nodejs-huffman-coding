const express = require("express");
const File = require("../Http/Controllers/File");

const apiRoutes = express.Router();

apiRoutes.route("/encode").post((req, res) => File.encode(req, res));
apiRoutes.route("/decode").post((req, res) => File.decode(req, res));

module.exports = apiRoutes;
