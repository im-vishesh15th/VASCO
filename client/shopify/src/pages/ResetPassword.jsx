import React, { useState } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { publicRequest, userRequest } from "../requestMethods";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("https://img.freepik.com/free-vector/gradient-colorful-grainy-dynamic-background_52683-101908.jpg") center;
  background-size: cover;
`;

const Wrapper = styled.div`
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

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [reset,setreset ] = useState(false);
  
  const history = useHistory();
  const location = useLocation();
  const email = location.state?.email ;
console.log(email);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await publicRequest.post("/auth/reset", { email, password });
      if (res.data.success) {
        history.push("/login");
      } else {
        setErrorMessage(res.data.message);
      }
    } catch (err) {
        console.log(err);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Reset Password</Title>
        <Form onSubmit={handleResetPassword}>
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errorMessage && <Error>{errorMessage}</Error>}
          <Button type="submit" disabled={reset}>Reset Password</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default ResetPassword;