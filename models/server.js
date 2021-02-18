const express = require('express'),
    cors = require('cors'),
    fileUpload = require('express-fileupload'),
    { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            search: '/api/search',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads',
        }

        this.dbConnect();

        this.middlewares();

        this.routes();
    }

    async dbConnect() {
        await dbConnection();
    }

    middlewares() {

        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`server running on port:`, this.port);
        });
    }

}


module.exports = Server;