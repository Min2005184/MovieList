import { useState } from "react";
import { Formik, Form } from "formik";
import { Row, Button, Input } from "reactstrap";
import axios from "axios";
import TextField from "./TextField";
import { Link, useNavigate } from "react-router-dom";
import './style.css';
import './BackgroundSlideShow.css';
import { urlGetEmail } from "../endpoint";
import * as Yup from 'yup';
import { useAuth } from '../components/AuthContext';

interface FormData {
  email: string;
  password: string;
}

const INITIAL_DATA: FormData = {
  email: '',
  password: '',
};

function RegistrationForm() {
  const [data, setData] = useState(INITIAL_DATA);
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const { setIsAuthenticated, setMemberId, setEmail } = useAuth();

  const handleSubmit = async (values: FormData) => {
    try {
      const response = await axios.get(`${urlGetEmail}/${values.email}`);
      console.log("Response Data: ", response.data);
      console.log("MemberID: ", response.data.id)

      if (!response.data) {
        console.error("No response data received.");
        alert('Failed to sign in. Please try again.');
        return;
      }

      console.log("Email: ", values.email);
      console.log("Password: ", values.password);

      if (response.data.email === values.email && response.data.password === values.password) {
        window.alert("Login successful");
        setIsAuthenticated(true);
        setMemberId(response.data.memberID);
        setEmail(values.email);
        navigate(`/animeList`);
      } else if (values.email == null || response.data.email !== values.email) {
        window.alert("Invalid Email!!");
      } else if (values.password == null || response.data.password !== values.password) {
        window.alert("Invalid Password!!");
      }      
      setData(INITIAL_DATA);
    } catch (error) {
      console.error('There was an error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  return (
    <>
      <div className="background-slideshow">
        <div className="slide slide1"></div>
        <div className="slide slide2"></div>
        <div className="slide slide3"></div>
        <div className="slide slide4"></div>
        <div className="slide slide5"></div>
        <div className="slide slide6"></div>
        <div className="slide slide7"></div>
        <div className="slide slide8"></div>
      </div>
      <div className="glass-background">
        <Formik
          initialValues={data}
          enableReinitialize={true}
          onSubmit={handleSubmit}   
          validationSchema={validateForm}
        >
          {(formikProps) => (
            <Form>
              <Row>
                <TextField field="email" displayName="Email" />
              </Row>
              <Row>
                <TextField field="password" displayName="Password" type={showPassword ? 'text' : 'password'} />
                <Input type="checkbox" onClick={togglePasswordVisibility} />
                <p>Show Password</p>
              </Row>
             
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  gap: '.5rem',
                  justifyContent: 'flex-end',
                }}
              >
                &nbsp;&nbsp;
                <Button type="submit" disabled={formikProps.isSubmitting}>
                  Sign in
                </Button>
                
              </div>    
              <div className="container signin">
                <p>Create Account?
                  <Link style={{ textDecoration: 'none', color: 'darkblue', fontWeight: 'bold' }} to={'/register'}> Register</Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default RegistrationForm;
