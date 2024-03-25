import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./user.css";
import { useLocation } from "react-router-dom";
import { userRequest } from "../../requestMethods";
import { useEffect ,useState} from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";





export default function User() {


  const [obj,setObj]=useState({});
const location=useLocation();
const id=location.pathname.split('/')[2];


  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  var res={};
useEffect(()=>{

  const get=async()=>{
     res=await userRequest.get(`users/find/${id}`)
    // console.log(res.data);
    setObj(res.data);
  }
  get();
},[]);
// console.log("on",obj);
const handleImageChange = (e) => {
  if (e.target.files[0]) {
    setImage(e.target.files[0]);
  }
};

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    let imageURL = "";
    if (image) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytesResumable(storageRef, image);
      imageURL = await getDownloadURL(ref(storage, `images/${image.name}`));
    }

    const updatedUser = {
      ...obj,
      username,
      email,
      password,
      img: imageURL || user.img, // Use new image URL if uploaded, otherwise keep existing image
    };

    await userRequest.put(`users/${id}`, updatedUser);
    alert("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update user. Please try again.");
  }
};
  
  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={obj.img}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{obj.username}</span>
              <span className="userShowUserTitle">Software Engineer</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{obj.username}</span>
            </div>
            
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">+91 123 456 67</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{obj.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">New York | USA</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form  onSubmit={handleUpdate}  className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  placeholder="annabeck99"
                  className="userUpdateInput"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Anna Becker"
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="annabeck99@gmail.com"
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Password</label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="....."
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder=""
                  className="userUpdateInput"
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={obj.img}
                  alt=""
                />
                <label htmlFor="file">
                  <Publish className="userUpdateIcon" />
                </label>
                <input onChange={handleImageChange} type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="userUpdateButton">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
