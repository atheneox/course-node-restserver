const { response } = require("express")


const validateFileUpload = (req, res = response, next) => {

    console.log("req.files", req.files);
    console.log("Object.keys(req.files).length ", Object.keys(req.files).length);
    console.log("req.files.file", req.files.file);


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'There are no files to upload - validateFileUpload'
        });
    }

    next();

}


module.exports = {
    validateFileUpload
}