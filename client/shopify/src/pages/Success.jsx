import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { userRequest } from '../requestMethods';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch } from 'react-redux';
import { clearCart } from "../redux/cartRedux";

const Container = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${mobile({ padding: "10px", margin: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  font-size: 32px;
`;

const Subtitle = styled.h2`
  font-weight: 300;
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Address = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const OrderDetails = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const OrderDetail = styled.p`
  font-size: 18px;
`;

const OrderSummary = styled.div`
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background-color: #fafafa;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 18px;
`;

const SummaryLabel = styled.span`
  font-weight: bold;
`;

const Success = () => {
  const location = useLocation();
  const [customerAddress, setCustomerAddress] = useState("");
  const [order, setOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [orderDate, setOrderDate] = useState("");
  const dispatch = useDispatch();

  dispatch(clearCart());

  useEffect(() => {
    const session_id = new URLSearchParams(location.search).get('session_id');
    const fetchSession = async () => {
      try {
        const res = await userRequest.post("/checkout/retrieve-session", { session_id });
        if (res.data && res.data.customer_details && res.data.customer_details.address) {
          const address = res.data.customer_details.address;
          const formattedAddress = `${address.line1}, ${address.city}, ${address.postal_code}, ${address.country}`;
          setCustomerAddress(formattedAddress);

          // Update the order with the extracted address
          const order_id = new URLSearchParams(location.search).get('order_id');
          await userRequest.put(`/orders/add/${order_id}`, { address: formattedAddress });
        }
      } catch (error) {
        console.log("Error fetching session data:", error);
      }
    };

    if (session_id) {
      fetchSession();
    }
  }, [location.search]);

  useEffect(() => {
    const order_id = new URLSearchParams(location.search).get('order_id');
    setOrderId(order_id);
    const fetchOrder = async () => {
      try {
        const res = await userRequest.get(`/orders/${order_id}`);
        if (res.data) {
          setOrder(res.data);
          setTotalAmount(res.data.amount);
          setOrderDate(new Date(res.data.createdAt).toLocaleDateString());
        }
      } catch (error) {
        console.log("Error fetching order data:", error);
      }
    };

    if (order_id) {
      fetchOrder();
    }
  }, [location.search]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>Thank you for your order!</Title>
        <Subtitle>Customer Address</Subtitle>
        <Address>{customerAddress}</Address>
        <OrderDetails>
          <OrderDetail>Order ID: {orderId}</OrderDetail>
          <OrderDetail>Order Date: {orderDate}</OrderDetail>
        </OrderDetails>
        <OrderSummary>
          <Subtitle>Order Summary</Subtitle>
          {order.products.map((product) => (
            <SummaryItem key={product.productId}>
              <span>{product.title} (Qty: {product.quantity})</span>
              <span>${product.price}</span>
            </SummaryItem>
          ))}
          <SummaryItem>
            <SummaryLabel>Total Amount Paid:</SummaryLabel>
            <span>${totalAmount}</span>
          </SummaryItem>
        </OrderSummary>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Success;
