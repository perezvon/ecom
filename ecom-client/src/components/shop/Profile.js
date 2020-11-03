import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import ShopLayout from "./ShopLayout";
import EditableText from "../EditableText";
import SEO from "../seo";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as SessionContext } from "../../context/SessionContext";
import formatCurrency from '../../lib/formatCurrency';

const ProfilePage = () => {
  const { state: user, updateUserData } = useContext(AuthContext);
  console.log(user)
  const {
    state: { store }
  } = useContext(SessionContext);
  const { isAuthenticated, sizing, wallet } = user;
  return (
    <ShopLayout>
      <SEO title={`Profile - ${store.name}`} />
      {isAuthenticated ? (
        <div>
          <h1>
            Profile for {user.firstName} {user.lastName}
          </h1>
          <h3>Sizing:</h3>
          {Object.keys(sizing).map(s => (
            <>
              <span>{s}:{" "}</span>
              <EditableText
                name={`${s}`}
                value={sizing[s]}
                type={isNaN(+sizing[s]) ? "text" : "number"}
                onClickOutside={(val) => updateUserData(user, { sizing: {...sizing, [s]: val} })}
              />
            </>
          ))}
          <h3>Wallet balance: ${formatCurrency(wallet)}</h3>
          
        </div>
      ) : (
        <Redirect to={`/login`} />
      )}
    </ShopLayout>
  );
};

export default ProfilePage;
