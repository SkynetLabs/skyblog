import { useEffect } from "react";
import { useHistory } from "react-router-dom";

//ScrollToTop resets the window scroll position when a user navigates to a new route
export default function ScrollToTop({ children }) {
  const history = useHistory(); //react router history instance
  useEffect(() => {
    //listener to detect when a window changes
    const unlisten = history.listen((location, action) => {
      if (action !== "POP") {
        window.scrollTo(0, 0);
      }
    });
    return () => {
      unlisten();
    };
  }, [history]);

  //no need to return any jsx
  return null;
}
