const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFile = (files, allowedExtension = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { fl } = files;
        const cutName = fl.name.split('.');
        const extension = cutName[cutName.length - 1];

        if (!allowedExtension.includes(extension)) {
            return reject(`extension ${extension} is not allowed - ${allowedExtension}`);
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);
        console.log("uploadPath", uploadPath);
        fl.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(tempName);
            console.log("tempName", tempName);
        });

    });

}


module.exports = {
    uploadFile
}