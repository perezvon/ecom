import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ShopLayout from "./ShopLayout";
import ProductImage from "./ProductImage";
import { Context as SessionContext } from "../../context/SessionContext";
import SEO from "../seo";
import { s3bucket, folder } from '../../config';

const ItemCardContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const ItemCard = styled(Link)`
  flex: 1 100%;
  margin-left: 1em;
  margin-right: 1em;
  margin-bottom: 1em;
  cursor: pointer;
  transition: all 0.1s;
  border-radius: 5px;
  border: 1px solid #d4d4d5;
  text-decoration: none;
  color: #333;
  &:hover {
    transform: translateY(-2px);
  }
  @media (min-width: 601px) {
    flex: 0 0 44%;
  }
`;

const CardDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px;
`;

const CardPrice = styled.span`
  font-size: 18px;
  color: #777;
`;

const ShopHome = () => {
  const {
    state: { store = {} }
  } = useContext(SessionContext);
  const { name, products, url } = store;
  
  const getProductImage = (p) => {
    return p.images[0] ? `${s3bucket}/${folder}/${p.images[0]}` : null;
  }
  return (
    <ShopLayout>
      <SEO title={`Home - ${name}`} />
      <ItemCardContainer>
        {products &&
          products.map(p => (
            <ItemCard key={p.id} to={`${url}/product/${p.productID}`}>
              <ProductImage src={getProductImage(p) || "https://picsum.photos/200/300"} />
              <CardDescription>
                <span>{p.name}</span>
                <CardPrice>${(p.price || 0).toFixed(2)}</CardPrice>
              </CardDescription>
            </ItemCard>
          ))}
      </ItemCardContainer>
    </ShopLayout>
  );
};

export default ShopHome;
