import { Add, Remove } from "@mui/icons-material";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { addProduct } from "../redux/cartRedux";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import Reviews from "../components/Reviews";
import ReviewForm from "../components/ReviewForm";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  @media (max-width: 900px) {
    flex-direction: column;
    padding: 20px;
    margin: 20px;
  }
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 50vw;
  height: 80vh;
  object-fit: fill;
  border-radius: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  @media (max-width: 978px) {
    width: 70vw;
    height: 70vh;
  }
`;
const ReviewsContainer = styled.div`
  max-height: 500px; // Set a fixed height
  overflow-y: auto; // Enable vertical scrolling
  padding: 10px;
  border: 1px solid #e0e0e0; // Optional: add a border to visually separate the reviews
  border-radius: 10px;
  width:50vw;
  margin: 30px; // Optional: add some margin to separate it from other elements
  
`;


const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
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

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f8f4f4;
  }
`;

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get("/products/find/" + id);
        setProduct(res.data);
        setSize(res.data.size[0]);
        setColor(res.data.color[0]);
      } catch (err) {
        console.error(err);
      }
    };
    getProduct();
  }, [id]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await publicRequest.get(`/reviews/${id}`);
        console.log(res);
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getReviews();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleReviewSubmitted = async () => {
    const res = await publicRequest.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  const handleClick = async () => {
    try {
      const uid = crypto.randomUUID();

      dispatch(addProduct({ ...product, quantity, color, size, uid }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <ImgContainer>
          <Image src={product.img} />
        </ImgContainer>
        <InfoContainer>
          <Title>{product.title}</Title>
          <Desc>{product.desc}</Desc>
          <Price>$ {product.price}</Price>
          <FilterContainer>
            <Filter>
              <FilterTitle>Color</FilterTitle>
              {product.color?.map((c) => (
                <FilterColor
                  color={c}
                  key={c}
                  onClick={() => setColor(c)}
                  selected={color === c}
                />
              ))}
            </Filter>
            <Filter>
              <FilterTitle>Size</FilterTitle>
              <FilterSize onChange={(e) => setSize(e.target.value)}>
                {product.size?.map((s) => (
                  <FilterSizeOption key={s}>{s}</FilterSizeOption>
                ))}
              </FilterSize>
            </Filter>
          </FilterContainer>
          <AddContainer>
            <AmountContainer>
              <Remove onClick={() => handleQuantity("dec")} />
              <Amount>{quantity}</Amount>
              <Add onClick={() => handleQuantity("inc")} />
            </AmountContainer>
            <Button onClick={handleClick}>ADD TO CART</Button>
          </AddContainer>
          
        </InfoContainer>

      </Wrapper>
      <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />
          <ReviewsContainer>
            <Reviews reviews={reviews} />
          </ReviewsContainer>
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default Product;
