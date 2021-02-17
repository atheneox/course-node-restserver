const Role = require('../models/role');
const { User, Category, Product } = require('../models');

const isRoleValid = async (rol = '') => {

    const rolExists = await Role.findOne({ rol });
    const roles = await Role.find({});

    console.log("rolExists", rolExists);
    console.log("rol", rol);
    console.log("roles", roles);

    if (!rolExists) {
        throw new Error(`Role ${rol} it's not registered`);
    }
}

const emailExists = async (email = '') => {

    // Verificar si el correo existe
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error(`email: ${email}, already registeredd`);
    }
}

const userExistsById = async (id) => {

    // Verificar si el correo existe
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error(`id is not exists ${id}`);
    }
}

/**
 * Categorias
 */
const categoryExistsById = async (id) => {

    // Verificar si el correo existe
    const categoryExists = await Category.findById(id);
    if (!categoryExists) {
        throw new Error(`id is not exists ${id}`);
    }
}

/**
 * Productos
 */
const productExistsById = async (id) => {

    // Verificar si el correo existe
    const productExists = await Product.findById(id);
    if (!productExists) {
        throw new Error(`id is not exists ${id}`);
    }
}

/**
 * Validar colecciones permitidas
 */
const allowedCollections = (collection = '', collections = []) => {

    const included = collections.includes(collection);
    if (!included) {
        throw new Error(`collection ${collection} it's not allowed, ${collections}`);
    }
    return true;
}


module.exports = {
    isRoleValid,
    emailExists,
    userExistsById,
    categoryExistsById,
    productExistsById,
    allowedCollections
}