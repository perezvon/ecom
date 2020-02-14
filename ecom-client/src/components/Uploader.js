import React, { useState, useContext } from 'react';
import {
  TextInput,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from 'grommet';
import { Context as UserContext } from '../context/UserContext';

const Uploader = ({ title }) => {
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState(null);
  const [data, setData] = useState(null);
  
  const { addManyUsers } = useContext(UserContext);

  const handleFileUpload = e => {
    e.preventDefault();
    setLoading(true);
    const files = e.target.files;
    const reader = new FileReader();
    reader.onload = e => {
      let rawData = reader.result.split('\n');
      let headers = [];
      let parsedData = [];
      rawData &&
        rawData.forEach((d, i) => {
          if (i === 0) headers = d.split(',');
          else {
            const dataObj = {};
            const dataArr = d.split(',');
            dataArr.forEach((field, j) => (dataObj[headers[j]] = field));
            parsedData.push(dataObj);
          }
        });
      setHeaders(headers);
      setData(parsedData);
      setLoading(false);
    };
    reader.readAsBinaryString(files[0]);
  };
  
  const importAll = () => {
    console.log(data)
    addManyUsers(data)
  }
  
  return (
    <React.Fragment>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <>
          <h3>{title}</h3>
          <form>
            <TextInput
              accept=".csv,.xls"
              type="file"
              onChange={handleFileUpload}
            />
          </form>
          {data && data.length && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map(h => (
                      <TableCell>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(d => (
                    <TableRow>
                      {Object.keys(d).map(k => (
                        <TableCell>{d[k]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={importAll}>Import all</Button>
            </>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default Uploader;
