import React, { useState } from 'react';
import {
  Table as GrommetTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from 'grommet';

import Modal from './Modal';

const Table = ({ headers, data, modalTitle }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const handleOpenModal = data => {
    setModalData(data);
    setModalOpen(true);
  };
  return (
    <>
      <GrommetTable>
        <TableHeader>
          <TableRow>
            {headers.map(h => (
              <TableCell>{h}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(d => (
            <TableRow onClick={() => handleOpenModal(d)}>
              {Object.keys(d).map(k => (
                <TableCell>{d[k]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </GrommetTable>
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          onEsc={() => setModalOpen(false)}
          onClickOutside={() => setModalOpen(false)}
        >
          {modalTitle || 'Detail'}
          {Object.keys(modalData).map(k => (
            <p>
              {k}: {modalData[k]}
            </p>
          ))}
        </Modal>
      )}
    </>
  );
};

export default Table;
