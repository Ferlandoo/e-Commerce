import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URI } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: "POST",
                body: { ...order },
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, paymentResult }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: "PUT",
                body: { ...paymentResult },
            }),
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URI,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery
} = ordersApiSlice;
