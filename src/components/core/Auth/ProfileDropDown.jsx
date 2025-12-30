import React, { useRef } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import{AiOutlineCaretDown} from "react-icons/ai"
import { useSelector } from 'react-redux';
import { useState } from 'react';
import useClickOutsideHandler from '../../../hooks/clickOutsideHandler';
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { logout } from '../../../services/operations/authAPI';



// here our profile small icon will be show using diceboard or image 
//  after click it will show a dropdown with options like my profile settings logout etc



const ProfileDropDown = () => {


    // get user data from redux store 

  const {user} = useSelector((state)=>state.profile);
  // to navigate on logout or other options
  // to dispatch logout action
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // need one useSatate to toggle dropdown
  const [isOpen, setIsOpen] = useState(false);
  // one more thing is to handle no matter where user click on the screen dropdown should close
  // for that we will use useRef hook -> used to refer to the dropdown element 
  // -> null initially because no element is referred yet

  const ref = useRef(null);

  // we will create somthing that handle click outside the dropdown
  useClickOutsideHandler(ref , ()=> setIsOpen(false));

  if (!user){
    return null;

  }

  return (
    <button className='relative' onClick={()=> setIsOpen(prev => !prev)} >
    <div className="flex items-center gap-x-1">
    <img
    src={user?.image}
    alt={`${user?.firstName} ${user?.lastName}`}
    className='aspect-square w-[30px] rounded-full object-cover'/>
    <AiOutlineCaretDown className="text-sm text-richblack-100" />
    </div>
    {/* // if isOpen is true then show the dropdown
    // stopPropagation is used to prevent the click event from bubbling up to parent elements */}
    {isOpen && (
      <div onClick={(e)=>e.stopPropagation()}
       className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
       ref={ref}>
       <Link to="/dashboard/my-profile" onClick={()=>setIsOpen(false)}>
       <div className='flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25'>
       <VscDashboard className='text-lg' />
        <span>Dashboard</span>

       </div>

       </Link>
        <div
            onClick={() => {
              dispatch(logout(navigate))
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>

      </div>
    )}

    </button>
    
  )
}

export default ProfileDropDown