const fs = require("fs");
const { Codec } = require("../../Lib/huffman");
const dbo = require("../../db/connection");
const { formatSizeUnit } = require("../Helper");

class File {
  encode = async (req, res) => {
    if (!req.files) {
      res.send({
        status: false,
        message: "Pilih file yang akan dikompres!",
      });

      return;
    }

    let file = req.files.file;

    let uploadedFileName = `${Date.now()}-${file.name}`;
    let uploadedFile = `./encode/uploads/${Date.now()}-${file.name}`;
    let compressedFile = `./encode/results/compressed-${uploadedFileName}`;

    await file.mv(uploadedFile);
    fs.readFile(uploadedFile, "utf8", (err, data) => {
      let codec = new Codec();
      let encodedString = codec.encode(data);

      fs.writeFile(compressedFile, encodedString[0], (err) => {
        if (err) {
          res.send({
            status: false,
            data: err,
          });
        }

        let data = {
          originalFile: {
            name: file.name,
            size: formatSizeUnit(fs.statSync(uploadedFile).size),
          },
          uploadedFile: {
            name: uploadedFileName,
            size: formatSizeUnit(fs.statSync(uploadedFile).size),
            url: `http://localhost:3000/encode/uploads/${uploadedFileName}`,
          },
          compressedFile: {
            name: `compressed-${uploadedFileName}`,
            size: formatSizeUnit(fs.statSync(compressedFile).size),
            url: `http://localhost:3000/encode/results/compressed-${uploadedFileName}`,
          },
        };

        let db = dbo.getDb();
        db.collection('encoding').insertOne(data);

        res.send({
          status: true,
          data: data,
        });
      });
    });
  };

  decode = async (req, res) => {
    if (!req.files) {
      res.send({
        status: false,
        message: "Pilih file yang akan dikompres!",
      });

      return;
    }

    let file = req.files.file;

    let uploadedFileName = `${Date.now()}-${file.name}`;
    let uploadedFile = `./decode/uploads/${uploadedFileName}`;
    let decompressedFile = `./decode/results/${uploadedFileName}`;

    await file.mv(uploadedFile);
    fs.readFile(uploadedFile, "utf8", (err, data) => {
      let codec = new Codec();
      let encodedString = codec.decode(data);

      fs.writeFile(decompressedFile, encodedString[0], (err) => {
        if (err) {
          res.send({
            status: false,
            data: err,
          });
        }

        let data = {
          originalFile: {
            name: file.name,
            size: formatSizeUnit(fs.statSync(uploadedFile).size),
          },
          uploadedFile: {
            name: uploadedFileName,
            size: formatSizeUnit(fs.statSync(uploadedFile).size),
            url: `http://localhost:3000/decode/uploads/${uploadedFileName}`,
          },
          decompressedFile: {
            name: `compressed-${uploadedFileName}`,
            size: formatSizeUnit(fs.statSync(decompressedFile).size),
            url: `http://localhost:3000/decode/results/${uploadedFileName}`,
          },
        };

        let db = dbo.getDb();
        db.collection('decoding').insertOne(data);

        res.send({
          status: true,
          data: data,
        });
      });
    });
  };
}

module.exports = new File();
