import { Add, Remove } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useHistory, Link, useLocation } from "react-router-dom";
import { editProductAdd, editProductRemove, removeProduct } from "../redux/cartRedux";
import { loadStripe } from "@stripe/stripe-js";

const KEY = process.env.STRIPE_KEY;
const stripePromise = loadStripe(KEY);

const Container = styled.div``;
const Wrapper = styled.div`padding: 20px; ${mobile({ padding: "10px" })}`;
const Title = styled.h1`font-weight: 300; text-align: center;`;
const Top = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 20px;`;
const TopButton = styled.button`padding: 10px; font-weight: 600; cursor: pointer; border: ${(props) => props.type === "filled" && "none"}; background-color: ${(props) => props.type === "filled" ? "black" : "transparent"}; color: ${(props) => props.type === "filled" && "white"};`;
const TopTexts = styled.div``;
const TopText = styled.span`text-decoration: underline; cursor: pointer; margin: 0px 10px; @media (max-width: 900px) { display: none; }`;
const Bottom = styled.div`display: flex; flex-direction: row; justify-content: space-between; @media (max-width: 2000px) { flex-direction: row; } @media (max-width: 900px) { flex-direction: column; }`;
const Info = styled.div`flex: 3;`;
const Product = styled.div`display: flex; justify-content: space-between; ${mobile({ flexDirection: "column" })}`;
const ProductDetail = styled.div`flex: 2; display: flex;`;
const Image = styled.img`width: 200px; margin: 5px;`;
const Details = styled.div`padding: 20px; display: flex; flex-direction: column; justify-content: space-around;`;
const ProductName = styled.span``;
const ProductId = styled.span``;
const ProductColor = styled.div`width: 20px; height: 20px; border-radius: 50%; border: black solid 1px; background-color: ${(props) => props.color};`;
const ProductSize = styled.span``;
const PriceDetail = styled.div`flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;`;
const ProductAmountContainer = styled.div`display: flex; align-items: center; margin-bottom: 20px;`;
const ProductAmount = styled.div`font-size: 24px; margin: 5px; ${mobile({ margin: "5px 15px" })}`;
const ProductPrice = styled.div`font-size: 30px; font-weight: 200; ${mobile({ marginBottom: "20px" })}`;
const Hr = styled.hr`background-color: #eee; border: none; height: 1px;`;
const Summary = styled.div`flex: 1; border: 0.5px solid lightgray; border-radius: 10px; padding: 20px; height: 50vh;`;
const SummaryTitle = styled.h1`font-weight: 200;`;
const SummaryItem = styled.div`margin: 30px 0px; display: flex; justify-content: space-between; font-weight: ${(props) => props.type === "total" && "500"}; font-size: ${(props) => props.type === "total" && "24px"};`;
const SummaryItemText = styled.span``;
const SummaryItemPrice = styled.span``;
const Button = styled.button`width: 100%; padding: 10px; background-color: black; color: white; font-weight: 600;`;

const Cart = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const cart = useSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);

  const manage = async () => {
    try {
      console.log(cart.products);
      const existingCart = await userRequest.get(`/carts/find/${currentUser._id}`);
      if (existingCart.data) {
        if (cart.products.length === 0) {
          const deleted = await userRequest.post(`/carts/delete/${existingCart.data._id}`, {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              title: item.title,
              quantity: item.quantity,
              img: item.img,
              color: item.color,
              price: item.price,
              uid: item.uid
            })),
          });
          console.log("Deleted Cart:", deleted);
        } else {
          const updatedCart = await userRequest.post(`/carts/${existingCart.data._id}`, {
            userId: currentUser._id,
            products: cart.products.map((item) => ({
              productId: item._id,
              title: item.title,
              quantity: item.quantity,
              img: item.img,
              color: item.color,
              price: item.price,
              uid: item.uid
            })),
          });
          console.log("Updated cart:", updatedCart);
        }
      } else {
        const newCart = await userRequest.post("/carts", {
          userId: currentUser._id,
          products: cart.products.map((item) => ({
            productId: item._id,
            title: item.title,
            quantity: item.quantity,
            img: item.img,
            color: item.color,
            price: item.price,
            uid: item.uid
          })),
        });
        console.log("New cart:", newCart);
      }
    } catch (error) {
      console.log("Error handling click:", error);
    }
  };

  useEffect(() => {
    const handleBackButton = () => {
      console.log('Back button clicked');
      manage();
    };
    if (location.pathname === '/cart' || location.pathname.startsWith('/product/'))
      window.addEventListener('popstate', handleBackButton);
  }, [location.pathname]);






  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;

      console.log("i am back");
      const res = await userRequest.post("/orders", {
        userId: currentUser._id,
        products: cart.products.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          productImg: item.img,
          title: item.title,
          price: item.price
        })),
        amount: cart.total,
      });

      setOrderId(res.data._id);

      const checkoutSession = await userRequest.post("/checkout/payment", {
        orderId: res.data._id,
        products: cart.products,
      });
      console.log("order posted");

      await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.stripeSession.id,

      });

    } catch (err) {
      console.log(err);
      history.push('/fail');
    }
  };

  const handleQuantity = (type, prod) => {
    if (type === "inc") {
      dispatch(editProductAdd({ ...prod }));
    } else if (type === "dec") {
      if (prod.quantity > 1) {
        dispatch(editProductRemove({ ...prod }));
      } else {
        dispatch(removeProduct({ ...prod }));
      }
    }
  };

  return (
    <Container>
      <Announcement />
      <Navbar />
      
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton onClick={manage}>
            <Link style={{ color: 'black', textDecoration: 'none', outline: 'none' }} to="/">
              CONTINUE SHOPPING..
            </Link>
          </TopButton>
          <TopTexts>
            <TopText>Shopping Bag({cart.quantity})</TopText>
            <TopText>Your Wishlist (4)</TopText>
          </TopTexts>
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product) => (
              <Product key={product._id}>
                <ProductDetail>
                  <Image src={product.img} />
                  <Details>
                    <ProductName><b>Product:</b> {product.title}</ProductName>
                    <ProductId><b>ID:</b> {product._id}</ProductId>

                    <ProductColor color={product.color} />
                    <ProductSize><b>Size:</b> {product.size}</ProductSize>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <Add onClick={() => handleQuantity("inc", product)} />
                    <ProductAmount>{product.quantity}</ProductAmount>
                    <Remove onClick={() => handleQuantity("dec", product)} />
                  </ProductAmountContainer>
                  <ProductPrice>$ {product.price * product.quantity}</ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            {currentUser ? <Button onClick={handlePayment}>CHECKOUT NOW </Button> : null}
            {!currentUser ? <TopButton onClick={() => (alert("Kindly Login First to Proceed Further"))} type="filled">CHECKOUT NOW</TopButton> : null}
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
