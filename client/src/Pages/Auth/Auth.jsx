import { useState } from "react";
import React from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../actions/currentUser";
import { login } from "../../actions/auth";
import "./Auth.css";
// import { ThemeContext } from "../../Context/ThemeContext";
import * as api from '../../api';

const googleProvider = new GoogleAuthProvider();

function Auth({ User, setAuthBtn = () => { }, setEditCreateChanelBtn }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { theme } = useContext(ThemeContext); // Removed unused variable
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUserId, setTempUserId] = useState(null);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    if (isSignUp && !name) {
      alert("Please enter your name");
      return;
    }

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;

      // Fetch Region for OTP check
      let region = "";
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        region = data.region;
      } catch (err) {
        console.log("Region fetch failed", err);
      }

      const { data } = await api.login({ email: user.email, name: user.displayName || name, region });

      if (data.otpRequired) {
        setTempUserId(data.userId || data.result?._id);
        setShowOtpInput(true);
        alert(data.message);
      } else {
        dispatch({ type: "AUTH", data });
        dispatch(setCurrentUser(JSON.parse(localStorage.getItem('Profile'))));
        setAuthBtn(false);
        navigate('/');
      }

    } catch (error) {
      console.error("Auth Error:", error.code, error.message);
      if (error.code === 'auth/invalid-credential') {
        alert("Invalid Email or Password. Please double check your credentials or Sign Up if you don't have an account.");
      } else if (error.code === 'auth/email-already-in-use') {
        alert("Email already in use. Please Sign In.");
      } else {
        alert(error.message);
      }
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.verifyOTP({ userId: tempUserId, otp });
      dispatch({ type: "AUTH", data });
      dispatch(setCurrentUser(JSON.parse(localStorage.getItem('Profile'))));
      alert("Login Successful");
      setAuthBtn(false);
      setShowOtpInput(false);
      navigate('/');
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      dispatch(login({ email: user.email, name: user.displayName }));
      setAuthBtn(false);
      navigate('/');
    } catch (error) {
      console.error("Google Auth Error:", error);
      alert(error.message);
    }
  };

  const onLogOutSuccess = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' }); // Clear localStorage
      dispatch(setCurrentUser(null)); // Clear Redux state
      alert("Log Out Successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="Auth_container" onClick={() => setAuthBtn(false)}>
      <div className="Auth_container2" onClick={(e) => e.stopPropagation()}>
        {User?.result ? (
          <>
            <p className="User_Details">
              <div className="Chanel_logo_App">
                <p className="fstChar_logo_App">
                  {User?.result?.name
                    ? User?.result?.name?.charAt(0)?.toUpperCase()
                    : User?.result?.email?.charAt(0)?.toUpperCase()}
                </p>
              </div>
              <div className="email_Auth">{User?.result?.email}</div>
            </p>

            <div className="btns_Auth">
              {User?.result.name ? (
                <Link to={`/chanel/${User?.result._id}`} className="btn_Auth">
                  Your Channel
                </Link>
              ) : (
                <input
                  type="submit"
                  className="btn_Auth"
                  value="Create Your Channel"
                  onClick={() => setEditCreateChanelBtn(true)}
                />
              )}

              <p className="btn_Auth">
                Points: {User?.result?.viewedVideos?.length * 5 || 0}
              </p>

              <div
                className="btn_Auth"
                onClick={onLogOutSuccess}
              >
                <BiLogOut />
                Log Out
              </div>
            </div>
          </>
        ) : (
          <div className="auth_form">
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            {showOtpInput ? (
              <form onSubmit={handleOtpVerify}>
                <p style={{ textAlign: "center", marginBottom: "10px" }}>Enter OTP sent to your email/mobile</p>
                <input type="text" placeholder="Enter OTP" className="auth_input" onChange={(e) => setOtp(e.target.value)} />
                <button type="submit" className="auth_btn">Verify OTP</button>
                <button onClick={() => setShowOtpInput(false)} className="google-btn" style={{ marginTop: "5px" }}>Back</button>
              </form>
            ) : (
              <form onSubmit={handleEmailAuth}>
                {isSignUp && (
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth_input"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth_input"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth_input"
                  required
                />
                <button type="submit" className="auth_btn">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
              </form>
            )}
            <div className="or_separator">OR</div>
            <button onClick={handleGoogleAuth} className="google-btn">
              Sign in with Google
            </button>
            <p onClick={() => setIsSignUp(!isSignUp)} className="toggle_auth_mode">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
