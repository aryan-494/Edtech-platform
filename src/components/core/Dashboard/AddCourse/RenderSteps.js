import { useSelector } from "react-redux";



export default function RenderSteps(){
    const {step} = useSelector((state)=>state.course)


    const steps =[
        
        {
            id:1,
            title:"Course Information",
        },
        {
          id: 2,
          title: "Course Builder",
        },
        {
          id: 3,
         title: "Publish",
        },
    ]

    return (
        <>
        <div className="relative mb-2 flex w-full justify-center">

        </div>

        </>
    )
}