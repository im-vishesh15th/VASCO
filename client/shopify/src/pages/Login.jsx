import { useState } from "react";
import styled from "styled-components";
import { login } from "../redux/apiCalls";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: url("https://img.freepik.com/free-vector/gradient-colorful-grainy-dynamic-background_52683-101908.jpg") center ;
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  height:auto;
  padding: 30px;
  background-color: rgba(0, 0, 0, 0.869);
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 229, 255);
  ${mobile({ width: "80%" })}
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #04e762;
  text-shadow:0px 0px 20px rgb(0, 229, 255)

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

const Error = styled.span`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isFetching,error} = useSelector((state) => state.user);
  const history = useHistory();
const [errorMessage,setErrorMessage]=useState(null);
  const handleClick = (e) => {
    e.preventDefault();
    const payload = { username, password };
    login(dispatch, payload);
    setErrorMessage(error);
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleClick} disabled={isFetching}>
            {isFetching ? 'Logging in...' : 'LOGIN'}
          </Button>
          {error && <Error>{errorMessage}</Error>}
          <Link href="#">Forgot your password?</Link>
          <Link href="#" onClick={() => history.push("/register")}>Create a new account</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
