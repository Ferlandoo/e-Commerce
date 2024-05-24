import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useGetProductsQuery, useDeleteProductMutation } from "../../slices/productsApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import { toast } from "react-toastify";
import Meta from "../../components/Meta";

const ProductListPage = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title='All Products - NodeMarket' />
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <LinkContainer to={`/admin/product/create`}>
            <Button className='btn-sm m-3'>
              <FaEdit /> Create Product
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='dark' className='btn-sm mx-2'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {data && <Paginate pages={data.pages} page={data.page} isAdmin={true} />}
    </>
  )
}

export default ProductListPage
