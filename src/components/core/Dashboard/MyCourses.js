/* MyCourses page shows all courses created by an instructor and lets them add a new course */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
      const result = await fetc
    }
  })

}