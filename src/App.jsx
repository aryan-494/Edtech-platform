import "./App.css";
import{Route , Routes} from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import CourseDetails from "./pages/CourseDetails";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="course/courseId" element={<CourseDetails/>}/>
    </Routes>

    </div>
  );
}

export default App;
