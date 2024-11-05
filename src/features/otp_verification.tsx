import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/verification.css"

const OtpVerification = () => {
    const [box1, setBox1] = useState("");
    const [box2, setBox2] = useState("");
    const [box3, setBox3] = useState("");
    const [box4, setBox4] = useState("");
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const location = useLocation();
  
    useEffect(() => {
        toast.info("Please enter otp", { autoClose: 2000 })
    }, []);
  
    const handleOtpVerification = async (e: React.FormEvent) => {
      e.preventDefault();
      const paylaod = { id: location.state.userId, otp: box1 + box2 + box3 + box4 }
      const api_hit = await fetch(`http://127.0.0.1:8000/otp-verification/`, {
        method: "POST",
        body: JSON.stringify(paylaod),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const api_response = await api_hit.json()
      if (api_hit.ok) {
        localStorage.setItem('auth_token', api_response.access_token)
        navigate("/chat-page", { state: location.state });
      }
      else {
        if (api_response.status === 400) {
          toast.error(api_response.message, { autoClose: 2000 })
        }
        console.log('---------');
        
      }
    }
  
    const handleResendOtp = async (e: React.FormEvent) => {
        
      e.preventDefault();
      try{
        const paylaod = { id: location.state.userId }
        const api_hit = await fetch(`http://127.0.0.1:8000/resend-otp/`, {
          method: "POST",
          body: JSON.stringify(paylaod),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const api_response = await api_hit.json()
        
        if (api_hit.ok) {
          if (api_response.status === 200) {
            toast.success("Otp sent successfully", { autoClose: 2000 })
          }
        }
        else {
          if (api_response.status === 400) {
            toast.error(api_response.message, { autoClose: 2000 })
          }
        }
      }
      catch (err) {
        console.log(err, "error from backend"); 
      }
    }
    const handleKeyUp = (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: string
      ) => {
        const target = e.target as HTMLInputElement;
        console.log(e.key);
        
        if (e.key === "Backspace"){
            let box_id = target.id
            box_id = box_id.slice(0, box_id.length-1) + (parseInt(box_id[3]) - 1)
            console.log(box_id);
            
            document.getElementById(box_id)?.focus()
        }
        else {
            if (target.value.length === 1 && ["box1", "box2", "box3"].includes(target.id)) {
                document.getElementById(id)?.focus();
              }	
        }
      };
  return (
    <>
      <div className="otp-container">
        <header className="otp-header">
        <h2>OTP Verification</h2>
        <p>Please enter the 4-digit OTP sent to your email.</p>
        </header>
        <form className="otp-form">
        <div className="otp-input-container">
            <input style={{ cursor:"text" }} type="text" 
              id="box1"
              onChange={(e) => setBox1(e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "box2")} 
              maxLength={1} 
              className="otp-input" />
            <input type="text" id="box2"
              onChange={(e) => setBox2(e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "box3")} 
              maxLength={1}
              className="otp-input" />
            <input type="text" maxLength={1} id="box3"
              onChange={(e) => setBox3(e.target.value)}
              onKeyUp={(e) => handleKeyUp(e, "box4")} className="otp-input" />
            <input type="text" id="box4"
              onChange={(e) => setBox4(e.target.value)}
			  onKeyUp={(e) => handleKeyUp(e, "box4")} maxLength={1} className="otp-input" />
        </div>
        <button type="submit" className="verify-btn" onClick={handleOtpVerification}>Verify</button>
        </form>
        <p className="resend-otp">Didn't receive the code? <button onClick={handleResendOtp}>Resend OTP</button></p>
    </div>
    <ToastContainer />
    </>
  )
}

export default OtpVerification
