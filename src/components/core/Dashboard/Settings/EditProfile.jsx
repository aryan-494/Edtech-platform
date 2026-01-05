import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]
export default function EditProfile() {
    const {token} = useSelector((state)=>state.auth)
    const {user} = useSelector((state)=>state.profile)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {register , handleSubmit,
        formState:{error},
    } = useForm();

    const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }




}