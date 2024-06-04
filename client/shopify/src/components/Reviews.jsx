import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 50px;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const ReviewContainer = styled.div`
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
`;

const Username = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;
const Date = styled.h3`
  font-size: 12px;
  color: #2d2d2d;
  font-style:italic bold;
`;

const Rating = styled.div`
  margin: 10px 0;
`;

const Comment = styled.p`
  font-size: 16px;
`;

const Reviews = ({ reviews }) => {
  return (
    <Container>
      <Title>Reviews</Title>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewContainer key={review._id}>
            <Username>{review.username}</Username>
            <Date>{review.createdAt.slice(0,10)}</Date>
            <Rating>Rating: {review.rating}/5</Rating>
            <Comment>{review.comment}</Comment>
          </ReviewContainer>
        ))
      ) : (
        <p>No reviews yet. Be the first to review this product!</p>
      )}
    </Container>
  );
};

export default Reviews;
