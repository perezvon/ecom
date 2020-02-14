import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import styled from "styled-components";

const StyledLoadingSpinner = styled(FiRefreshCw)`
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = ({ size }) => <StyledLoadingSpinner size={size} />;

export default LoadingSpinner;
