import React, { useEffect, useState } from 'react'
import "../css/signup.css"
import { useLocation, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state) {
        if (location.state.message) {
            toast.success(location.state.message, { autoClose: 2000 })
            navigate(location.pathname, { state: null, replace: true })
        }
        }
}, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/login/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const api_response = await response.json();
      console.log(api_response, '---api_response----');
      if (api_response.status !== 200) {
        toast.error(api_response.message,  { autoClose: 2000 });
      } else {
        // localStorage.setItem('auth_token', api_response.access_token)
        navigate("/otp-verification", { state: { message: api_response.message, userId: api_response.data.id, name: api_response.data.name } });
        // toast.success("Login successfull",  { autoClose: 2000 });
      }
    } catch (error) {
      console.log(error, "----error-----");
    }
  };
  return (
    <>
    <div className="signup-container">
    <div className="signup-header">Login here</div>
    <form>
      <input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
      <input type="password" name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" onClick={handleLogin}>Login</button>
      <a href="/signup" className="signin-link">Don't have account? Create One</a>
    </form>
  </div>
  <ToastContainer />
  </>
  )
}

export default Login;
