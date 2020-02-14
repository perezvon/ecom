import React from "react";
import {
  Table as GrommetTable,
  TableHeader,
  TableBody,
  TableRow
} from "grommet";
import styled from "styled-components";

const StyledGrommetTable = styled(GrommetTable)`
  width: 100%;
`;

export const Table = ({ headers, tableData }) => (
  <StyledGrommetTable>
    <TableHeader>{headers}</TableHeader>
    <TableBody>
      <TableRow></TableRow>
      {tableData}
    </TableBody>
  </StyledGrommetTable>
);
