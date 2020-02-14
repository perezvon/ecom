import React from "react";
import { Provider as AuthProvider } from "./context/AuthContext";
import { Provider as StoreProvider } from "./context/StoreContext";
import { Provider as ProductProvider } from "./context/ProductContext";
import { Provider as UserProvider } from "./context/UserContext";
import { Provider as OrderProvider } from "./context/OrderContext";
import { Provider as CartProvider } from "./context/CartContext";
import { Provider as SessionProvider } from "./context/SessionContext";
import AppRouter from "./AppRouter";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <StoreProvider>
          <UserProvider>
            <OrderProvider>
              <CartProvider>
                <SessionProvider>
                  <AppRouter />
                </SessionProvider>
              </CartProvider>
            </OrderProvider>
          </UserProvider>
        </StoreProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
