const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;
const filePath = './saved/';

import {eventDao, userDao} from './server';
import {thisFunctionCreatesNewToken} from "./server";


module.exports = class Uploader {

    uploadContract(req, res) {
        console.log("Saving POSTed contract");

        let form = new IncomingForm();

        form.on('file', (field, file) => {
            // Do something with the file
            // e.g. save it to the database
            // you can access it using file.path

            // console.log(file);


            fs.readFile(file.path, (err, data) => {
                if (err) return console.log(err);

                // let fileName = createFilePath(file.name);

                eventDao.uploadContract({
                    eventId: req.params.event_id,
                    performanceId: req.params.performanceId
                }, data, response => {
                    // console.log(response);
                    console.log('UPLOADED');
                });

                console.log(data);


                // fs.writeFile(filePath + fileName, data, err => {
                //     console.log(fileName);
                //     if (err) return console.log('Error writing file');
                //     console.log('File saved!')
                // });
            });

        });


        form.on('end', () => {
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({message: 'Uploaded contract!', jwt: token});
        });

        form.parse(req);

        function createFilePath(startName) {
            let number = 0;
            while (number < 20) {
                try {
                    let name = number.toString() + startName;
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
    };

    uploadEventPicture(req, res) {
        console.log("Saving POSTed event picture");

        let form = new IncomingForm();

        form.on('file', (field, file) => {
            fs.readFile(file.path, (err, data) => {
                if (err) return console.log(err);
                eventDao.uploadPicture(req.params.event_id, data, response => {
                    // console.log(response);
                    console.log('UPLOADED');
                });
                console.log(data);
            });

        });
        form.on('end', () => {
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({message: 'Uploaded event picture!', jwt: token});
        });
        form.parse(req);
    }

    uploadUserPicture(req, res) {
        console.log("Saving POSTed user picture");

        let form = new IncomingForm();

        form.on('file', (field, file) => {
            fs.readFile(file.path, (err, data) => {
                if (err) return console.log(err);
                userDao.uploadPicture(req.params.user_id, data, response => {
                    // console.log(response);
                    console.log('UPLOADED');
                });
                console.log(data);
            });

        });
        form.on('end', () => {
            let token = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({message: 'Uploaded user picture!', jwt: token});
        });
        form.parse(req);
    }
};
