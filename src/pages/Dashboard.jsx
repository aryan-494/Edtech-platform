/* What is this component?
-> Dashboard where user will come just after log in 

What stays constant?
-> the side bar and nav bar will be same there is no change into it 

What changes?
-> here i will see change in pages. we'll go to the Only
 the main content changes based on route (Profile, Courses, Settings). from here 

What data does it need?
-> i have already navbar so i want side bar and one thing that help to change page globaly(according to user) 

What happens while data loads?
-> we'll setup one loader 
 */

import { useSelector } from "react-redux";
import {Sidebar} from "../components/core/Dashboard/Sidebar"
import { Outlet } from "react-router-dom";



function Dashboard(){


  const {loading : profileLoading} = useSelector((state)=>state.profile)
  const {loading : authLoading} = useSelector((state)=>(state.auth))

  if (profileLoading || authLoading) {
    return(
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )


  }

  return(
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
    <Sidebar/>
    <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
      <div  className="mx-auto w-11/12 max-w-[1000px] py-10">
        <Outlet/>
      </div>
    </div>

    </div>


  )





}