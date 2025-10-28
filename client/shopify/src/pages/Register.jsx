import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("https://img.freepik.com/free-vector/gradient-colorful-grainy-dynamic-background_52683-101908.jpg") center;
  background-size: cover;
`;

const Wrapper = styled.div`
margin:30px;
  width: 90%;
  max-width: 400px;
  padding: 30px;
  background-color: rgba(0, 0, 0, 0.869);
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 229, 255);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #04e762;
  text-shadow: 0px 0px 20px rgb(0, 229, 255);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 15px 0px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  background-color: #ffffff;
  transition: background-color 0.3s ease;

  &:focus {
    outline: none;
    background-color: #f9f9f9;
  }
`;

const Agreement = styled.span`
  font-size: 12px;
  margin-top: 20px;
  color: #666;
  &:hover {
    color: #04e762;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  background-color: #04e762;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin: 10px 0px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8bf878;
  }
`;

const Error = styled.span`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const Link = styled.a`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  text-decoration: none;

  &:hover {
    color: #04e762;
  }
`;

const Register = () => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
        "https://vasco-acp9.onrender.com/api/auth/register",
        userData
      );
      console.log("Res=" + response);
      history.push("/login");
      window.location.reload();
    } catch (error) {
      setError(error.response.data.error);
      console.error("Error:", error.response.data.error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Create an Account</Title>
        <Form>
          <Input name="name" placeholder="First Name" onChange={handleChange} />
          <Input name="lastName" placeholder="Last Name" onChange={handleChange} />
          <Input name="username" placeholder="Username" onChange={handleChange} />
          <Input name="email" placeholder="Email" onChange={handleChange} />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>Privacy Policy</b>
          </Agreement>
          <Link href="#" onClick={() => history.push("/login")}>Account Already Exists ?...</Link>
          {error && <Error>{error}</Error>}
          <Button onClick={handleSubmit}>Create</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
