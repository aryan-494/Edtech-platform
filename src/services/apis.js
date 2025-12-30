const BASE_URL = "http://localhost:4000/app/v1"


export const endpoints = {
    SENDOTP_API:BASE_URL+"/auth/sendotp",
    LOGIN_API :BASE_URL+"/auth/login",
    SIGNUP_API :BASE_URL+"/auth/signup",
    RESETPASSWORDTOKEN_API : BASE_URL+"/auth/reset-password-token",
    RESETPASSWORD_API :BASE_URL+"/auth/reset-password",
};



// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}


export const profileEndpoints ={
  GET_USER_DETAILS_API:BASE_URL+"/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API:BASE_URL+"/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API:BASE_URL+"/profile/instructorDashboard"

}
