import "./App.css";
import{Route , Routes} from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import CourseDetails from "./pages/CourseDetails";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Signup from "./pages/Signup"
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/course/courseId" element={<CourseDetails/>}/>

      <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route/>


    <Route 
         path="/login"
         element={
           <OpenRoute>
             <Login/>
           </OpenRoute>}>
      
    </Route>


    <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />  


      <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />  

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />  






    </Routes>
    

    </div>
  );
}

export default App;
