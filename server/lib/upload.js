"use strict";

var _server = require("./server");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var IncomingForm = require('formidable').IncomingForm;

var filePath = './saved/';

module.exports =
/*#__PURE__*/
function () {
  function Uploader() {
    _classCallCheck(this, Uploader);
  }

  _createClass(Uploader, [{
    key: "uploadContract",
    value: function uploadContract(req, res) {
      console.log("Saving POSTed contract");
      var form = new IncomingForm();
      form.on('file', function (field, file) {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path
        console.log('Received file!');
        fs.readFile(file.path, function (err, data) {
          if (err) return console.log(err); // let fileName = createFilePath(file.name);

          _server.eventDao.uploadContract({
            eventId: req.params.event_id,
            performanceId: req.params.performanceId
          }, data, function (response) {
            // console.log(response);
            console.log('UPLOADED');
          });

          console.log(data); // fs.writeFile(filePath + fileName, data, err => {
          //     console.log(fileName);
          //     if (err) return console.log('Error writing file');
          //     console.log('File saved!')
          // });
        });
      });
      form.on('end', function () {
        var token = (0, _server.thisFunctionCreatesNewToken)(req.email, req.userId);
        res.json({
          message: 'Uploaded contract!',
          jwt: token
        });
      });
      form.parse(req);

      function createFilePath(startName) {
        var number = 0;

        while (number < 20) {
          try {
            var name = number.toString() + startName;

            if (fs.existsSync(filePath + name)) {
              number++;
              console.log("The file exists.");
            } else {
              console.log('The file does not exist.');
              return name;
            }
          } catch (err) {
            console.error(err);
            return (Math.random() * 99999999).toString();
          }
        }

        return (Math.random() * 99999999).toString();
      }
    }
  }, {
    key: "uploadEventPicture",
    value: function uploadEventPicture(req, res) {
      console.log("Saving POSTed event picture");
      var form = new IncomingForm();
      form.on('file', function (field, file) {
        fs.readFile(file.path, function (err, data) {
          if (err) return console.log(err);

          _server.eventDao.uploadPicture(req.params.event_id, data, function (response) {
            // console.log(response);
            console.log('UPLOADED');
          });

          console.log(data);
        });
      });
      form.on('end', function () {
        var token = (0, _server.thisFunctionCreatesNewToken)(req.email, req.userId);
        res.json({
          message: 'Uploaded event picture!',
          jwt: token
        });
      });
      form.parse(req);
    }
  }, {
    key: "uploadUserPicture",
    value: function uploadUserPicture(req, res) {
      console.log("Saving POSTed user picture");
      var form = new IncomingForm();
      form.on('file', function (field, file) {
        fs.readFile(file.path, function (err, data) {
          if (err) return console.log(err);

          _server.userDao.uploadPicture(req.params.user_id, data, function (response) {
            // console.log(response);
            console.log('UPLOADED');
          });

          console.log(data);
        });
      });
      form.on('end', function () {
        var token = (0, _server.thisFunctionCreatesNewToken)(req.email, req.userId);
        res.json({
          message: 'Uploaded user picture!',
          jwt: token
        });
      });
      form.parse(req);
    }
  }]);

  return Uploader;
}();