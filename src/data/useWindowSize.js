import { useLayoutEffect, useState } from "react";

//useWindowSize() returns the new window size whenever the window is resized
//used by certain components to dynamically adjust to smaller window widths
export function useWindowSize() {
  //size -> state for storing window size as [width, height]
  const [size, setSize] = useState([0, 0]);
  //layout effect runs whenever a screen using useWindowSize() is loaded
  //create event listener for window resize
  useLayoutEffect(() => {
    //update size state
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
