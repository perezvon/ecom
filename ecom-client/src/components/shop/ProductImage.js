import React from 'react';
import styled from 'styled-components';

const ProductImageContainer = styled.div`
  position: relative;
  display: block;
  flex: 0 0 auto;
  padding: 0;
  background: rgba(0, 0, 0, 0.05);
`;

const ImageAligner = styled.div`
  width: 100%;
  padding-bottom: 100%;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 1;
  transition: none 0s ease 0s;
`;

export default ({ src }) => (
  <ProductImageContainer>
    <ImageAligner />
    <ProductImage src={src} />
  </ProductImageContainer>
);
