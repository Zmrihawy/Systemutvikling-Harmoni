//@flow
const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;

import {eventDao, userDao} from './server';
import {thisFunctionCreatesNewToken} from "./server";

/**
 * Uploader class
 */
module.exports = class Uploader {

    /**
     * This function uploads a contract to the database via eventDao
     */
    uploadContract(req: *, res: *): void {
        console.log("Saving POSTed contract");

        let form: IncomingForm = new IncomingForm();

        form.on('error', err =>{
            console.log('UPLOAD CANCELLED');
            console.log(err);
        });

        form.on('file', (field, file) => {
            // Do something with the file
            // e.g. save it to the database
            // you can access it using file.path

            console.log('Received file!');


            fs.readFile(file.path, (err, data) => {
                if (err) return console.log(err);

                // let fileName = createFilePath(file.name);

                eventDao.uploadContract(req.params.performance_id, data, response => {
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
    };

    /**
     * This function uploads an eventpicture to the database via eventDao
     */
    uploadEventPicture(req: *, res: *): void {
        console.log("Saving POSTed event picture");

        let form: IncomingForm = new IncomingForm();

        form.on('error', err =>{
            console.log('UPLOAD CANCELLED');
            console.log(err);
        });

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
            let token: string = thisFunctionCreatesNewToken(req.email, req.userId);
            res.json({message: 'Uploaded event picture!', jwt: token});
        });
        form.parse(req);
    }

    /**
     * This function uploads a profilepicture to the database via eventDao
     */
    uploadUserPicture(req: *, res: *): void {
        console.log("Saving POSTed user picture");

        let form: IncomingForm = new IncomingForm();

        form.on('error', err =>{
            console.log('UPLOAD CANCELLED');
            console.log(err);
        });


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


