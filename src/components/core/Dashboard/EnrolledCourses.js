import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";

 
 
 
 export default function EnrolledCourses(){
    // when i talk about the enrolled courses we talk about student who is enrolled for the particular course 
    // first we will check user is vailed user 
    const {token} = useSelector((state)=>(state.auth));
    const navigate = useNavigate();

    // one useState for got course 
    const [enrolledCourse , setEnrolledCourse] = useState(null);

    const getEnrolledCourses = async()=>{
        try{
        const res = await getUserEnrolledCourses(token);
        setEnrolledCourse(res);
    }
    catch(error){
        console.log("could not fetched getEnrolledCourses ");
    }

}
useEffect(() => {
    getEnrolledCourses();
  }, [])
    

  return (
    <>
    <div className="text-3xl text-richblack-50">Enrolled Courses</div>
    {!enrolledCourse ?
     (<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center"> <div className="spinner"></div></div>)
     :// cousre fetched but it empty
     (!enrolledCourse.lenght ?
     (<div  className="grid h-[10vh] w-full place-content-center text-richblack-5">
        You have not enrolled in any course yet.
     </div>)
     :
     // in other case show user all the courses data 

     (
        <div className="my-8 text-richblack-5">
        {/* Headings */}
        <div  className="flex rounded-t-lg bg-richblack-500 ">
        <p  className="w-[45%] px-5 py-3">Course Name</p>
        <p className="w-1/4 px-2 py-3">Duration</p>
        <p className="flex-1 px-2 py-3">Progress</p>
        </div>
        {enrolledCourse.map((course , i , arr)=>{
            <div className={`flex items-center  border border-richblack-700 ${
            i=arr.lenght-1 ? "rounded-b-lg" :"rounded-none"}`}
            key={i}>
            <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
            onClick={()=>{
                navigate( `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)
            }}>
            <img
                src={course?.thumbnail}
                alt="course_img"
                 className="h-14 w-14 rounded-lg object-cover"
            />
            <div className="flex max-w-xs flex-col gap-2">
            <p className="font-semibold">{course.courseName}</p>
            <p  className="text-xs text-richblack-300">{course.courseDescription.length>50 ?
             (`${course.courseDescription.slice(0, 50)}...` ):(course.courseDescription.length)} </p>

            </div>
            </div>
            <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
               <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>


            </div>
        })}
        
    

        </div>
     ))}

    </>
  )


 }