// lets think what sidear contain -> 
// here we will show side bar in dahsboard section ->Sidebar = role-based navigation controller
//Sidebar
/*  ├── Knows user role
 ├── Filters links by permission
 ├── Navigates dashboard routes
 ├── Offers global actions (settings, logout)
 └── Never changes across pages
 */


import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sidebarLinks } from '../../../data/dashboard-links'



export default function Sidebar (){

    // first we need to know role of the user then we will so sidebar accordingly 
    // untill the auth is not done user not confirmed will show them loading 


    const {user,loading : profileLoading} = useSelector((state)=>state.profile)
    const {loading: authLoading}=useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()



    
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return(
    <div className='flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10'>
    <div className='flex flex-col'>
    {sidebarLinks.map((link)=>{
        //“If this link is restricted and the user doesn’t belong here → hide it
        if(link.type && user?.accountType !==link.type) return null ;
    })}


    </div>

    </div>
  )


}
