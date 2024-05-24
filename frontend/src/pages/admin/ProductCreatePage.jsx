import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useCreateProductMutation,
  useUploadProductImageMutation
} from '../../slices/productsApiSlice';
import Meta from '../../components/Meta';

const ProductCreatePage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const [uploadProductImage, { isLoading: loadingUploadImage }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newProduct = {
      name,
      price,
      image,
      coverImage,
      brand,
      category,
      countInStock,
      description,
    };
    const result = await createProduct(newProduct);
    if (result.error) {
      toast.error(result.error);
    }
    else {
      navigate('/admin/productlist');
    }
  };

  const createUploadHandler = (setImageFunc) => async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await uploadProductImage(formData).unwrap();
      toast.success(response.message);
      setImageFunc(response.image);
    } catch (error) {
      toast.error(error?.data?.message || error.message)
    }
  };

  const uploadImageHandler = createUploadHandler(setImage);
  const uploadCoverImageHandler = createUploadHandler(setCoverImage);

  return (
    <>
      <Meta title='Create Product - NodeMarket' />
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {loadingCreate && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {loadingUploadImage && <Loader />}
          <Form.Group controlId='image' className='my-2'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter image'
              value={image}
              onChange={(e) => setImage}
            ></Form.Control>
            <Form.Control type='file' label='Choose File' onChange={uploadImageHandler}></Form.Control>
          </Form.Group>

          {loadingUploadImage && <Loader />}
          <Form.Group controlId='coverImage' className='my-2'>
            <Form.Label>Cover Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter cover image'
              value={coverImage}
              onChange={(e) => setCoverImage}
            ></Form.Control>
            <Form.Control type='file' label='Choose File' onChange={uploadCoverImageHandler}></Form.Control>
          </Form.Group>

          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter Stock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-2'>
            Create
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default ProductCreatePage
