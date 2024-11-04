import React, { useState } from 'react'
import "../css/signup.css"
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      email: email,
      name: name,
      password: password,
    };
    console.log(data);
    try {
      const response = await fetch(`http://127.0.0.1:8000/signup/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const api_response = await response.json();
      console.log(api_response, '---api_response----');
      if (api_response.status !== 201) {
        toast.error(api_response.message,  { autoClose: 2000 });
      } else {
        navigate("/login", { state: { message: api_response.message } });
        // toast.success("Signup completed.",  { autoClose: 2000 });
      }
    } catch (error) {
      console.log(error, "----error-----");
    }
  };
  return (
    <>
    <div className="signup-container">
    <div className="signup-header">Sign Up</div>
    <form>
      <input type="email" name="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
      <input type="text" name="name" placeholder="Name" required onChange={(e) => setName(e.target.value)} />
      <input type="password" name="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" onClick={handleSignUp}>Sign Up</button>
      <a href="/login" className="signin-link">Already have an account? Sign In</a>
    </form>
  </div>
  <ToastContainer />
  </>
  )
}

export default SignUp;
