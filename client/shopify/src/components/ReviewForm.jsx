import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import styled from "styled-components";

import { publicRequest } from "../requestMethods";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin: 30px;
  width:50vw;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-size:30px
`;

const TextArea = styled.input`
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  font-size: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
  font-size:20px
`;

const Button = styled.button`
  padding: 10px;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #004d4d;
  }
`;

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await publicRequest.post(`/reviews`, {
        productId,
        rating,
        comment: reviewText,
        username, // Include the username in the request payload
      });
      setRating(0);
      setReviewText("");
      setUsername("");
      onReviewSubmitted();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Title>Write a Review</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Username"
          required="true"
          maxLength={15}

        />
        <ReactStars

          name="rate1"
          count={5}
          value={rating}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          activeColor="#ffd700"
          onChange={(nextValue) => setRating(nextValue)}
          size={30}
        />
        <TextArea
          maxLength={200}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
        />
        <Button type="submit">Submit Review</Button>
      </form>
    </Container>
  );
};

export default ReviewForm;
