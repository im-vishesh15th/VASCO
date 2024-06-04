import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { userRequest } from '../requestMethods';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useHistory } from 'react-router-dom';

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Fail = () => {
    const history = useHistory();

    const location = useLocation();
    const order_id = new URLSearchParams(location.search).get('order_id');


    console.log(location);
    useEffect(() => {
        const deleteOrder = async () => {
            try {
                const res = await userRequest.delete(`/orders/client/${order_id}`);
                console.log("Order deleted successfully:", res.data);
            } catch (error) {
                console.log("Error deleting order:", error);
            }
        };

        deleteOrder();
    }, [order_id]);

    return (
        <Container>
            <Navbar />
            <Wrapper>
                <Title>Payment Failed</Title>
                <p>Unfortunately, your payment could not be processed. Please try again later.</p>
            </Wrapper>
            <Footer />
        </Container>
    );
};

export default Fail;
