import styled from "styled-components";
import { mobile } from "../../responsive";
import axios from "axios";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";


const Container = styled.div`
  width: 100vw;
  height: 100vh;
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


const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const Register = () => {
  const [file, setFile] = useState(null);

  const history=useHistory();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });



  const handleSubmit = async (product) => {
    
    try {
      console.log("pp=",product);
      const response = await axios.post(
        "https://vasco-2.onrender.com/api/auth/register",
        product
      );

      history.push('/users')
      console.log(response.data); // Log the response data if needed
    } catch (error) {
      console.error("Error:", error);
    }
  };
    
  
    const handleClick =  async(e) => {
      e.preventDefault();
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);


      
  
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const product = { ...userData, img: downloadURL};
            //console.log("pro=",product);
            try {
              handleSubmit(product);  
              history.push('/users')
             // Log the response data if needed
            } catch (error) {
              console.error("Error:", error);
            }
          });
        }
      );
    };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN USER</Title>
        <Form>
          <Input name="img" type="file" id="file"  onChange={(e) => setFile(e.target.files[0])} />
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
      
          <Button onClick={handleClick}>CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
