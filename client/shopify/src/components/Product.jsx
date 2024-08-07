import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";
import { v4 as uuidv4 } from 'uuid';
import Typography from '@mui/material/Typography';


const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 50%;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
  border-radius: 10%;
`;

const Info2 = styled.div`
  opacity: 0;
  width: 50%;
  height: 10%;
  position: absolute;
  top: 10px;
  left: auto;
  background-color: #000000;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 1s ease;
  cursor: pointer;
  border-radius: 25px;
  &:hover {
    background-color: #00757568;
    transform: scale(1.1);
  }
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 400px;
 border: 2px solid black;

  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  position: relative;
 border-radius: 10%;
  &:hover ${Info}{
    opacity: 1;
  }
  &:hover ${Info2}{
    opacity: 1;
  }
`;

const Circle = styled.div`
  width: 350px;
  height: 450px;
  border-radius:25px;
  background-color: white;
  position: absolute;
  display: flex;
  justify-content:center;
`;

const Image = styled.img`
  height: 450px;
  width:350px;
  z-index: 2;
  object-fit:contain;
  
  
  
  
`;

const Icon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Product = ({ item }) => {
  console.log("item=",item);
  const dispatch = useDispatch();
 const history= useHistory();
  const manage = ()=>{
   history.push(`/product/${item._id}`);
   window.location.reload();

  };
  const handleClick = async () => {
    try {
      const uid = uuidv4();
      dispatch(addProduct({ ...item, quantity:1, color:item.color[0], size:item.size[0], uid }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Container>
      <Circle >
      <Image src={item.img} />
     
      </Circle>
      
      <Info>
     
       
        <Icon onClick={()=>handleClick()}>
          <ShoppingCartOutlined />
        </Icon>
        <Icon onClick={()=>manage()}>
        
          <SearchOutlined />

        </Icon>
        <Icon>
          <FavoriteBorderOutlined />
        </Icon>
      
      </Info>
      <Info2>
      <Typography variant="subtitle1" sx={{ fontSize: '2rem', zIndex: "3",color:'white' }} >
              ${item.price}
            </Typography>
         </Info2>
      
      
    </Container>
    
     </>
  );
};

export default Product;
