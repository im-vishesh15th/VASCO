import styled from "styled-components";

const Container = styled.div`
  height: 50px;
  background-color: black;
  color: #04e762;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  margin-bottom:20px;
  text-shadow:#eb116f 1.5px 2px;
  
`;

const Announcement = () => {
  return <Container>Super Deal! Free Shipping on Orders Over $50</Container>;
};

export default Announcement;
