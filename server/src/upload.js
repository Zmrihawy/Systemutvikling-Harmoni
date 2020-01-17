const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;


module.exports = function upload(req, res) {
    console.log("Saving POSTed file");

    let form = new IncomingForm()

    form.on('file', (field, file) => {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path

        console.log(1);

        fs.writeFile('test.txt', file, err => {
            console.log(2);
            if (err) {
                console.log('Error writing file');
                throw err;
            }
            console.log('File saved!')
        });
    });


    form.on('end', () => {
        res.json();
    });
};