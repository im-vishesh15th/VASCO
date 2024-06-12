import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #04e762 0%, #eb116f 100%);
  flex-direction: column;
  animation: ${fadeIn} 1s ease-in-out;
  perspective: 1000px;
`;

const Spinner = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
  transform-style: preserve-3d;
`;

const Message = styled.h1`
  margin-top: 20px;
  font-size: 24px;
  color: #ffffff;
  animation: ${pulse} 1.5s infinite;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 10%, transparent 10%),
              radial-gradient(circle, rgba(255, 255, 255, 0.2) 10%, transparent 10%);
  background-position: 0 0, 50px 50px;
  background-size: 100px 100px;
  animation: ${fadeIn} 3s infinite alternate;
`;

const LoadingPage = () => {
  return (
    <Container>
      <AnimatedBackground />
      <Spinner />
      <Message>Connecting to server, please wait...</Message>
    </Container>
  );
};

export default LoadingPage;
