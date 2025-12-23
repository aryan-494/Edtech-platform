/* when i am in this page what i think first 
First think about the user’s intention.
Then think about backend needs.
Then think about success and failure. */

/* User action
 → Collect data
 → Call backend
 → Handle success
 → Handle failure
 */


import React from 'react'
import { endpoints } from '../apis';
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { setLoading, setToken } from '../../slices/authSlice';
import { setUser } from '../../slices/profileSlice';


const {
    SENDOTP_API ,
    LOGIN_API,
    SIGNUP_API,
    RESETPASSWORDTOKEN_API,
    RESETPASSWORD_API,
}=  endpoints;

export function sendOtp(email , navigate){
    return async(dispatch)=>{
        const toastId= toast.loading("Loading..")
        dispatch(setLoading(true));
          try{
              const response = await apiConnector("POST", SENDOTP_API ,
                {email,  checkUserPresent: true,} );
                    console.log("SENDOTP API RESPONSE............", response)

                     console.log(response.data.success)

                 if (!response.data.success) {
                    throw new Error(response.data.message)
                   } 
                   toast.success("OTP SENT SUCCESSFULLY ");
                   navigate("/verify-email");

             }
             catch(error){
                console.log("SEND OTP ERROR...", error)
                toast.error("Could Not Send OTP");
             }
             dispatch(setLoading(false));
             toast.dismiss(toastId);



    }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


export function login(email , password , navigate ){
    return async (dispatch)=>{
        const toastId = toast.loading("Loading..");
        dispatch(setLoading(true));
        try{
            const response = apiConnector("POST" , LOGIN_API , {email , password})
            console.log("LOGIN RESPONSE.....", response);

            if(!(await response).data.success){
                throw new Error((await response).data.message)
            }
            toast.success("Logged in successfully ....")
            dispatch(setToken((await response).data.token));
            const userImage = response?.data?.user.image ? response.data.user.image :(`https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`);
            dispatch(setUser( {...response.data.user , image: userImage }));

           localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
   // dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORDTOKEN_API, {email,})

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

      console.log("RESET Password RESPONSE ... ", response);


      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  }
}