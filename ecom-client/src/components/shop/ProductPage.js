import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ShopLayout from './ShopLayout';
import ProductImage from './ProductImage';
import { Context as CartContext } from '../../context/CartContext';
import { Context as SessionContext } from '../../context/SessionContext';
import { Context as AuthContext } from '../../context/AuthContext';
import { Button, Select, CheckBox, TextInput } from 'grommet';
import { FiTag } from 'react-icons/fi';
import SEO from '../seo';
import { s3bucket, folder } from '../../config';
import formatCurrency from '../../lib/formatCurrency';

const ProductMain = styled.div`
  min-height: 50vh;
  display: flex;
`;

const ProductOptions = styled.div`
  border: 1px solid rebeccapurple;
  padding: 10px;
`;

const UserSizeContainer = styled.div``;

const ProductCta = styled.div`
  display: flex;
  flex-flow: column;
  padding: 30px;
`;

const ImageContainer = styled.div`
  width: 300px;
`;

const AddToCartButton = styled(Button)`
  margin-top: 20px;
`;

const PreWrappedText = styled.p`
  white-space: pre-wrap;
`;

const ProductPage = ({ data }) => {
  const [useSizeOnFile, setUseSizeOnFile] = useState(true);
  const [sizingInfo, setSizingInfo] = useState();
  const [qty, setQty] = useState(1);
  const [productInfo, setProductInfo] = useState({});
  const [size, setSize] = useState();
  const { addToCart } = useContext(CartContext);
  const { state: user } = useContext(AuthContext);
  const {
    state: { store = {} },
  } = useContext(SessionContext);
  useEffect(() => {
    if (store && store.products) {
      const pathArr = window.location.pathname.split('/');
      const id = pathArr[pathArr.length - 1];
      const product = store.products.find(p => p.productID === id);
      if (product) {
        setProductInfo(product);
        if (product.inventory) setSize(Object.keys(product.inventory)[0]);
        if (user.isAuthenticated && user.sizing) {
          setSizingInfo(<p>{user.sizing.shirt}</p>);
          if (useSizeOnFile) setSize(user.sizing.shirt);
        }
      }
    }
  }, [store, useSizeOnFile, user.isAuthenticated, user.sizing]);

  const handleSizeOptionChange = val => {
    setUseSizeOnFile(val, () => val && setSize(user.size.shirt));
  };

  const getProductImage = p => {
    if (!p.images) return;
    return p.images[0] ? `${s3bucket}/${folder}/${p.images[0]}` : null;
  };

  return (
    <ShopLayout>
      <SEO title={`${productInfo.name} - ${store.name}`} />
      <ProductMain>
        <ImageContainer>
          <ProductImage
            src={
              getProductImage(productInfo) || 'https://picsum.photos/200/300'
            }
          />
        </ImageContainer>
        <ProductCta>
          <div>
            <h3>{productInfo.name}</h3>
            <PreWrappedText>{productInfo.description}</PreWrappedText>
            <span>${formatCurrency(productInfo.price)}</span>
          </div>
          {productInfo.inventory && (
            <>
              <CheckBox
                checked={useSizeOnFile}
                label="Use size on file"
                onChange={e => handleSizeOptionChange(e.target.checked)}
              />
              {useSizeOnFile && (
                <UserSizeContainer>{sizingInfo}</UserSizeContainer>
              )}
            </>
          )}

          <ProductOptions>
            {!useSizeOnFile && (
              <>
                <h3>
                  Size <FiTag />
                </h3>
                <Select
                  options={Object.keys(productInfo.inventory)}
                  value={size}
                  onChange={({ option }) => setSize(option)}
                />
              </>
            )}
            <h4>Quantity</h4>
            <TextInput
              placeholder="qty"
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
          </ProductOptions>

          <AddToCartButton
            label="Add to cart"
            onClick={() => addToCart({ ...productInfo, size, qty })}
          />
        </ProductCta>
      </ProductMain>
      <Link to={store.url}>Back</Link>
    </ShopLayout>
  );
};

export default ProductPage;
