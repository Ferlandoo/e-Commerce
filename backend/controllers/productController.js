import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (request, response) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(request.query.pageNumber) || 1;

    const keyword = request.query.keyword
        ? { name: { $regex: request.query.keyword, $options: 'i' } }
        : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    response.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id);
    if (product) {
        response.json(product);
    }
    else {
        response.status(404);
        throw new Error('Product not found');
    }
});


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (request, response) => {
    const { name, price, description, image, coverImage, brand, category, countInStock } = request.body;

    const product = new Product({
        user: request.user._id,
        name,
        price,
        description,
        image,
        coverImage,
        brand,
        category,
        countInStock
    });

    const createdProduct = await product.save();
    response.status(201).json(createdProduct);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (request, response) => {
    const { name, price, description, image, coverImage, brand, category, countInStock } = request.body;

    const product = await Product.findById(request.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.coverImage = coverImage;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        response.json(updatedProduct);
    }
    else {
        response.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        response.json({ message: 'Product removed' });
    }
    else {
        response.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (request, response) => {
    const { rating, comment } = request.body;
    const product = await Product.findById(request.params.id);

    if (product) {
        const alreadyReviewed = product.review.find(
            review => review.user.toString() === request.user._id.toString()
        );

        if (alreadyReviewed) {
            response.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: request.user.name,
            rating: Number(rating),
            comment,
            user: request.user._id
        };

        product.review.push(review);

        product.numReviews = product.review.length;

        product.rating = product.review.reduce(
            (acc, item) => item.rating + acc, 0) / product.review.length;

        await product.save();
        response.status(201).json({ message: 'Review added' });
    } else {
        response.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (request, response) => {
    const product = await Product.find({}).sort({ rating: -1 }).limit(3);
    response.status(200).json(product);
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
};
