import React from "react";
import { Box } from "grommet";
import styled from 'styled-components';
import { s3bucket, folder } from '../config';

const OverflowingBox = styled(Box)`
  overflow: auto;
`

const PreWrappedText = styled.p`
  white-space: pre-wrap;
`

const ProductImage = styled.img`
  width: 150px;
`

const ProductDetail = ({ item }) => {
  const { itemID, name, price, description, availableStores, images, inventory } = item;
  return (
    <OverflowingBox pad="large" background="light-3">
      <h3>Item Detail - {name}</h3>
      <p>{name}</p>
      {images && images.map(image => <ProductImage src={`${s3bucket}/${folder}/${image}`} alt={name} />)}
      <p>{price}</p>
      <PreWrappedText>{description}</PreWrappedText>
      <p>{availableStores.join(",")}</p>
      {inventory &&
        Object.keys(inventory).map(k => (
          <p>
            {k}: {inventory[k]}
          </p>
        ))}
    </OverflowingBox>
  );
};

export default ProductDetail;
