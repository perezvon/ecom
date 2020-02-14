import React from "react";
import { Layer } from "grommet";
import styled from "styled-components";
import { FiXCircle } from "react-icons/fi";

const StyledLayer = styled(Layer)`
  @media (min-width: 650px) {
    min-width: 500px;
  }
`;

const CloseButton = styled(FiXCircle)`
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 4px;
`;
const Modal = ({ modalOpen, setModalOpen, children, ...rest }) => {
  return (
    <StyledLayer {...rest}>
      <CloseButton size={24} onClick={() => setModalOpen(false)} />
      {children}
    </StyledLayer>
  );
};

export default Modal;
