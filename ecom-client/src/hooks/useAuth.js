import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "../context/AuthContext";

const useAuth = (callback, validate) => {
  const {
    state: { permissions, role }
  } = useContext(AuthContext);
  const hasPermissions = requires => {
    return permissions?.includes(requires) || role === 1;
  };

  return {
    hasPermissions
  };
};

export default useAuth;
