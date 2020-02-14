import { useState, useEffect } from 'react';
import axios from 'axios';

const serverURL = 'http://localhost:3001';

const useForm = (callback, validate) => {

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback(values);
    }
  }, [errors]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };
  
  const setInitialValues = initialValues => {
    setValues(values => ({ ...values, ...initialValues }))
  }
  
  const handleFileChange = async (event) => {
    event.persist();
    const file = event.target.files[0];
    const [fileName, fileType] = event.target.files[0]?.name.split('.');
    const response = await axios.post(`${serverURL}/sign_s3`, {
      fileName,
      fileType
    });
    try {
      const { signedRequest, url } = response.data?.data?.returnData;
      console.log('got a signed request back from s3')
      console.log(response.data)
      const options = {
        headers: {
          'Content-Type': fileType
        }
      }
      try {
        const responseFromS3 = await axios.put(signedRequest, file, options);
        console.log(`responseFromS3`, responseFromS3.data);
        setValues(values => ({ ...values, [event.target.name]: event.target.value }));
      } catch(e) {
        alert('Something went wrong with the upload 🙀 \n Please try again!')
        console.error(JSON.stringify(e))
      }
    } catch(e) {
      console.error(JSON.stringify(e))
    }
    
    
  }

  return {
    handleChange,
    handleFileChange,
    handleSubmit,
    setInitialValues,
    values,
    errors,
  }
};

export default useForm;