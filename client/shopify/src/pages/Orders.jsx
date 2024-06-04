import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { userRequest } from "../requestMethods";

const Container = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
`;
const FilterColor = styled.div`
  border: black solid 1px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
  ${(props) =>
    props.selected &&
    `
    border: 2.5px solid #04e762;
    padding: 1px;
  `}
`;
const Wrapper = styled.div`
  padding: 40px;
  ${mobile({ padding: "20px" })}
`;

const Title = styled.h1`
  font-weight: 600;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
`;

const OrderContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const OrderDate = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  color: #555;
`;

const ProductList = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 10px;
  margin-right: 20px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.span`
  font-weight: bold;
  font-size: 3rem;
  margin-bottom: 5px;
`;

const ProductQuantity = styled.span`
  color: #777;
  font-size: 2rem;
`;

const Orders = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userRequest.get(`/orders/find/${currentUser._id}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>Your Orders ...</Title>
        {orders.map((order) => (
          <OrderContainer key={order._id}>
            <OrderHeader>
              <OrderDate>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</OrderDate>
              <OrderDate>Order Id: {order._id}</OrderDate>
              <OrderDate>Status: {order.status}</OrderDate>
            </OrderHeader>
            <ProductList>
              {order.products.map((product) => (
                <ProductItem key={product.productId}>
                  <ProductImage src={product.productImg} alt={product.title} />
                  <ProductDetails>
                    <ProductName>{product.title}</ProductName>
                    <ProductQuantity>Quantity: {product.quantity}</ProductQuantity>
                    <FilterColor color={product.color} />

                  </ProductDetails>
                </ProductItem>
              ))}
            </ProductList>
          </OrderContainer>
        ))}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Orders;
