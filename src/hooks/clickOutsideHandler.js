import { useEffect } from "react";


export default function useClickOutsideHandler(ref, handler){
    useEffect(()=>{
        // Define the listener function to be called on click/touch events
        const listener = (event)=>{
            // if the touch or click is inside the ref element, do nothing
            if (!ref.current || ref.current.contains(event.target)) {
               return ;
            }
            // else call the handler function
            handler(event);
        }

        // now add the event listeners for mousedown and touchstart
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
      // Cleanup function to remove the event listeners when the component unmounts or when the ref/handler dependencies change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Only run this effect when the ref or handler function changes
}