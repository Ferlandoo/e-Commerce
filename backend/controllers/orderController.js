import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (request, response) => {
    const { orderItems, shippingAddress, paymentMethod } = request.body;

    if (orderItems && orderItems.length === 0) {
        response.status(400);
        throw new Error('No order items');
    } else {
        // get the ordered items from our database
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        });

        // map over the order items and use the price from our items from database
        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find(
                (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
            );
            return {
                ...itemFromClient,
                product: itemFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,
            };
        });

        // calculate prices
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
            calcPrices(dbOrderItems);

        const order = new Order({
            orderItems: dbOrderItems,
            user: request.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        response.status(201).json(createdOrder);
    }
});

// @desc    Get logged in user orders
// @route   GET /api/myorders
// @access  Private
const getMyOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find({ user: request.user._id });
    response.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id).populate('user', 'name email');

    if (order) {
        response.status(200).json(order);
    } else {
        response.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (request, response) => {
    const { verified, value } = await verifyPayPalPayment(request.body.id);
    if (!verified) throw new Error('Payment not verified');

    // check if this transaction has been used before
    const isNewTransaction = await checkIfNewTransaction(Order, request.body.id);
    if (!isNewTransaction) throw new Error('Transaction has been used before');

    const order = await Order.findById(request.params.id);

    if (order) {
        // check the correct amount was paid
        const paidCorrectAmount = order.totalPrice.toString() === value;
        if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: request.body.id,
            status: request.body.status,
            update_time: request.body.update_time,
            email_address: request.body.payer.email_address,
        };

        const updatedOrder = await order.save();

        response.json(updatedOrder);
    } else {
        response.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        response.status(200).json(updatedOrder);
    } else {
        response.status(404);
        throw new Error('Order not found');
    }
});

// @desc   Get all orders
// @route  GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (request, response) => {
    const orders = await Order.find({}).populate('user', 'id name');
    response.status(200).json(orders);
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders };
