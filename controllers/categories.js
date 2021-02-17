const { response } = require('express');
const { Category } = require('../models');


const getCategories = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'categories found correctly'
            },
            body: {
                total,
                categories
            }
        }
    );
}

const getCategory = async (req, res = response) => {

    const { id } = req.params;
    const category = await Category.findById(id)
        .populate('user', 'name');

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'category found correctly'
            },
            body: {
                category
            }
        }
    );

}

const createCategory = async (req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            status: {
                code: 400,
                msg: `category ${categoryDB.name}, already exist`
            }
        });
    }

    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);

    await category.save();

    res.status(201).json({
        status: {
            code: 201,
            msg: 'category created succcessfully'
        },
        body: {
            category
        }
    });

}

const updateCategory = async (req, res = response) => {

    const { id } = req.params;
    const { status, name, ...data } = req.body;

    data.name = name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'category updated successfully'
            },
            body: {
                category
            }
        }
    );

}

const deleteCategory = async (req, res = response) => {

    const { id } = req.params;

    const categoryExists = await Category.findOne({ _id: id, status: false });

    if (categoryExists) {
        res.status(404).json({
            status: {
                code: 404,
                msg: 'category not found'
            }
        });
    }

    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'category removed successfully'
            },
            body: {
                category
            }
        }
    );

}


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}