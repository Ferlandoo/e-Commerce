import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (request, response) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = request.body;

    if (orderItems && orderItems.length === 0) {
        response.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map(x => ({
                ...x,
                product: x._id,
                _id: undefined,
            })),
            user: request.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
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
    const order = await Order.findById(request.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: request.body.id,
            status: request.body.status,
            update_time: request.body.update_time,
            email_address: request.body.payer?.email_address ?? request.user.email,
        };

        const updatedOrder = await order.save();

        response.status(200).json(updatedOrder);
    } else {
        response.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (request, response) => {
    response.send('updateOrderToDelivered');
});

// @desc   Get all orders
// @route  GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (request, response) => {
    response.send('getOrders');
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders };
