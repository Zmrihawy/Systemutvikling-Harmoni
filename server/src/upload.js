const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;
const filePath = './saved/';

module.exports = function upload(req, res) {
    console.log("Saving POSTed file");

    let form = new IncomingForm();

    form.on('file', (field, file) => {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path

        // console.log(file);


        fs.readFile(file.path, (err, data) => {
            if (err) return console.log(err);

            let fileName = createFilePath(file.name);


            fs.writeFile(filePath + fileName, data, err => {
                console.log(fileName);
                if (err) return console.log('Error writing file');
                console.log('File saved!')
            });
        });

    });


    form.on('end', () => {
        res.json();
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