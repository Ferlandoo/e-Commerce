import { PRODUCTS_URL, UPLOADS_URI } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ pageNumber, keyword }) => ({
                url: PRODUCTS_URL,
                params: {
                    pageNumber,
                    keyword
                },
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: PRODUCTS_URL,
                method: "POST",
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCTS_URL}/${product.productId}`,
                method: "PUT",
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOADS_URI}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: "DELETE",
            }),
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery
} = productsApiSlice;
