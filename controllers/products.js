const { response, json } = require('express');
const { Product } = require('../models');


const getProducts = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'products found correctly'
            },
            body: {
                total,
                products
            }
        }
    );

}

const getProduct = async (req, res = response) => {

    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'product found correctly'
            },
            body: {
                product
            }
        }
    );

}

const createProduct = async (req, res = response) => {

    const { status, user, ...body } = req.body;
    const name = req.body.name.toUpperCase();

    const productDB = await Product.findOne({ name });

    if (productDB) {
        return res.status(400).json({
            code: 400,
            msg: `product ${productDB.name}, already exist`
        });
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product(data);

    await product.save();

    res.status(201).json({
        status: {
            code: 201,
            msg: 'product created succcessfully'
        },
        body: {
            product
        }
    });

}

const updateProduct = async (req, res = response) => {

    const { id } = req.params;
    const { status, user, ...data } = req.body;

    if (user) {
        data.user = user.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'product updated successfully'
            },
            body: {
                product
            }
        }
    );

}

const deleteProduct = async (req, res = response) => {

    const { id } = req.params;

    const productExists = await Product.findOne({ _id: id, status: false });

    if (productExists) {
        res.status(404).json({
            status: {
                code: 404,
                msg: 'product not found'
            }
        });
    }

    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'product removed successfully'
            },
            body: {
                product
            }
        }
    );

}


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}