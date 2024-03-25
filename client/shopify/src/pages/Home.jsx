import React, { useEffect } from "react";
import Announcement from "../components/Announcement";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Products from "../components/Products";
import Slider from "../components/Slider";
import { useDispatch, useSelector } from "react-redux";
import { fetchPreviousProducts } from "../redux/cartRedux";

const Home = () => {
  const dispatch=useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchPreviousProducts(currentUser._id));
    }
  }, [dispatch, currentUser]);
   

  return (
    <div>
      <Announcement />
      <Navbar />
      <Slider />
      <Categories />
      <Products/>
      <Newsletter/>
      <Footer/>
    </div>
  );
};

export default Home;
