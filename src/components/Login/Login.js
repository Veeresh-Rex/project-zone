/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDataLayerValues } from "../../datalayer";
import { actions } from '../../reducer';
import { magic } from "../../magic";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link as RouterLink } from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { ToastContainer, toast } from 'react-toastify';
import { makeStyles } from "@material-ui/core/styles";
import "./Login.css";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "91vh",
  },
  image: {
    backgroundImage:
      "url(https://external-preview.redd.it/nWy4RIyzJvtfD4auPKg4Bq98sXMoffFuyOjioNoDkPk.jpg?auto=webp&s=48b0cc1113f6cbcc0c6be939edae4ee5d2f169cc)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();

  const history = useHistory();
  const [loading, setLoading] = useState("");
  const [{ user,ProjectDetails,isAuthenticated,query}, dispatch] = useDataLayerValues();

  useEffect(() => {
    isAuthenticated && history.push("/");
  }, [isAuthenticated, history]);

  const [fields,setFields] = useState({
    email:"",
    password:""
  })

  const { email,password } = fields;

  const handleSocialLogin = async () => {
    try {
      setLoading("Loading...");

      await magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: new URL("/callback", window.location.origin).href,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = (event) => {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    event.preventDefault();
  
    if (email === "") {
      toast.error('Please enter your email ');
    } 
    else if (!emailTest.test(email)) {
      toast.error('Please enter a valid email');
    }
    else if (password === "") {
      toast.error('Please enter a secure password');
    }
    else if(password.length < 6 ){
      toast.error('Password should have at least 6 characters');
    } 
    else {
      const userData = {
        ...user,email: email,password:password
      };
     
      clearData();
      setUserAuth(userData);
    }
  };

  const clearData = () => {
    setFields({
      email:"",
      password:""
    });
  };

  const setUserAuth = (userData) => {

    dispatch({
      type: actions.SET_USER,
      user: userData,
    });

   // we can check if authenticated by finding user in db and can send to home page from here
  }


  return (
    <div className="login">
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <ToastContainer position="top-right" />
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                value={password}
                onChange={handleChange}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                >
                Sign In
              </Button>
              <div className="google-btn" onClick={handleSocialLogin}>
                <div className="google-icon-wrapper">
                  <img
                    className="google-icon"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    alt="google-icon"
                  />
                </div>
                <p className="btn-text">
                  <b>Sign in with google</b>
                </p>
              </div>

              <Grid container>
                <Grid item xs>
                  <RouterLink to="/"  style={{ textDecoration: "none" }}>
                    Forgot password?
                  </RouterLink>
                </Grid>
                <Grid item>
                  <RouterLink to="/signup"  style={{ textDecoration: "none" }}>
                    {"Don't have an account? Sign Up"}
                  </RouterLink>
                </Grid>
              </Grid>
              <Box mt={5}></Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
