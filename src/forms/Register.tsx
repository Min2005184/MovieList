import { useState } from "react";
import { Formik, Form } from "formik";
import { Input, Row, Button } from "reactstrap";
import axios from "axios";
import TextField from "./TextField";
import { Link, useNavigate } from "react-router-dom";
import './style.css'
import './BackgroundSlideShow.css'
import { urlCreateMember, urlGetEmail } from "../endpoint";
import * as Yup from 'yup';
import { useProfile } from "../pages/UserProfile/useProfile";
import { useAuth } from "../components/AuthContext";

interface FormData {
  userName: string;
  age: string;
  email: string;
  password: string;
}

const INITIAL_DATA: FormData = {
  userName: '',
  age: '',
  email: '',
  password: '',
};

function RegistrationForm() {
  const [data, setData] = useState(INITIAL_DATA);
  
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setProfile } = useProfile(); // Get setProfile from context
  const { setEmail, setIsAuthenticated } = useAuth();

  const handleSubmit = async (values: any) => {
    try {
      const response = await axios.post(urlCreateMember, {
        userName: values.userName,
        age: values.age,
        email: values.email,
        password: values.password
      });
      console.log("Email", values.email);
      setData(INITIAL_DATA);
      console.log("Member Detail: ", response.data);
      
      localStorage.removeItem('profile'); // Clear profile from local storage
      setProfile(response.data); // Update profile context
      setEmail(values.email)
      setIsAuthenticated(true)
      navigate(`/edit-profile`);

      alert('Successful Account Creation!');
    } catch (error) {
      console.error('There was an error creating the account!', error);
      alert('Failed to create account. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = Yup.object({
    userName: Yup.string().required('UserName is required'),
    age: Yup.string().required('Age is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
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
          onSubmit={(values) => handleSubmit(values)}  
          
          validationSchema={validateForm}
        >
          {(formikProps) => (
            <Form>
              <Row>
                <TextField field="userName" displayName="UserName" />
              </Row>
              <Row>
                <TextField field="age" displayName="Age" />
              </Row>
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
                  Register
                </Button>
              </div>    
              <div className="signin">
                <p>Already a member? 
                  <Link style={{ textDecoration: 'none', color: 'darkblue', fontWeight: 'bold' }} to={'/signIn'}>Sign in</Link>
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
//passport policy(at least 6 characters,number, special characters and alphbet)