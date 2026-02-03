/* MyCourses page shows all courses created by an instructor and lets them add a new course */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCourseDetails } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn"
import { VscAdd } from "react-icons/vsc"
import {CoursesTable} from "../Dashboard/InstructorCourses/CoursesTable"

/* Flow ->
Get instructor’s auth token
Call backend → “give me my courses”
Store courses in state
Show them in a table
Provide “Add Course” button */


export default function MyCourses() {
  const {token} = useSelector((state)=>state.auth)
  const navigate = useNavigate();
  

  // to add course in the recent page 
  const [courses , setCourses] = useState();
  useEffect(()=>{
    const fetchCourses=async()=>{
      const result = await fetchCourseDetails(token);
      if(result){
        setCourses(result);
      }
    }
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })


  return (

     <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>

  )

}
