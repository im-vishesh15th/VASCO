import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { publicRequest } from "../requestMethods";

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
  ${mobile({ width: "80%", overflowY: "auto", maxHeight: "80vh" })}
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Error = styled.span`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const SuccessMessage = styled.span`
  color: green;
  font-size: 14px;
  margin-top: 10px;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reset2,setreset2 ] = useState(false);
  const history = useHistory();
  const [reset,setreset ] = useState(false);
  const handleSendOtp = async (e) => {
    //console.log("hi");
    e.preventDefault();
    setError("");
    setSuccess("");
    setreset(true);

    try {
      const res = await publicRequest.post("/auth/send-otp", { email });
      console.log("hi");
      if (res.data.success) {
        setIsOtpSent(true);
        setSuccess("OTP sent to your email");
      } else {
        setError("Failed to send OTP");
      }
    } catch (err) {
      setreset(false);
      setError("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setreset2(true);

    try {
      const res = await publicRequest.post("/auth/verify-otp", { email, otp });
      if (res.data.success) {
        history.push({
            pathname: '/resetPassword',
            state: { email: email }
          });
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setreset2(false)
      setError("Invalid OTP");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Forgot Password</Title>
        <Form>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isOtpSent}
          />
          {isOtpSent && (
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}
          {isOtpSent ? (
            <Button disabled={reset2}onClick={handleVerifyOtp}>Verify OTP</Button>
          ) : (
            <Button  disabled={reset} onClick={handleSendOtp}>Send OTP</Button>
          )}
          {error && <Error>{error}</Error>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>
      </Wrapper>
    </Container>
  );
};

export default ForgotPassword;