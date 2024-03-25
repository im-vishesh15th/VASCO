import React from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {logout} from "../../redux/apiCalls"
import { useHistory } from "react-router-dom";

export default function Topbar() {
  const currentUser = useSelector((state) => state.user.currentUser);
 const dispatch = useDispatch();
const history=useHistory()

 const manage=(e)=>{
logout(dispatch);
history.push("/login");

 };
  const url=currentUser.img
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">VascoAdmin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <img src={url} alt="" className="topAvatar" />
        </div>
        <div className="topbarIconContainer">
        <button style={{backgroundColor:'black',color:'white',border:'pink',fontSize:'125%'}} onClick={()=>manage() }>Logout</button>
          </div>
      </div>
    </div>
  );
}
