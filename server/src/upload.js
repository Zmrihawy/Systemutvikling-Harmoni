const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;


module.exports = function upload(req, res) {
    console.log("Saving POSTed file");

    let form = new IncomingForm();

    form.on('file', (field, file) => {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path

        console.log(typeof file);

        // file.text()
        //     .then(text => console.log(text))
        //     .catch(err => console.log(err));

        fs.writeFile('file.pdf', file, err => {
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

    form.parse(req);
};