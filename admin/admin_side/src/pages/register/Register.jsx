import styled from "styled-components";
import { mobile } from "../../responsive";
import axios from "axios";
import { useState } from "react";
import { Redirect } from "react-router-dom";


const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const Register = () => {

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin:true
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://vasco-2.onrender.com/api/auth/register",
        userData
      );
      
      <Redirect to="/login" />
      console.log(response.data); // Log the response data if needed
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Input name="name" placeholder="name"  />
          <Input placeholder="last name" />
          <Input name="username" placeholder="username"  value={userData.username}
          onChange={handleChange} />
          <Input name="email" placeholder="email" value={userData.email}
          onChange={handleChange}/>
          <Input  name="password" placeholder="password" value={userData.password}
          onChange={handleChange}/>
          <Input name="confirmpassword" placeholder="confirm password"   value={userData.confirmpassword}
          onChange={handleChange} />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button onClick={handleSubmit}>CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
