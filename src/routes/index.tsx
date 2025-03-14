import {onMount} from "solid-js";
import {useNavigate} from "@solidjs/router";

export default function Index() {
  const navigate = useNavigate();
  onMount(() => {
    const savedLocation = localStorage.getItem("oxide_last_loc");
    if (savedLocation && savedLocation !== location.pathname) {
      navigate(savedLocation);
    } else {
      navigate("/home");
    }
  })
  return (
    <></>
  )
}