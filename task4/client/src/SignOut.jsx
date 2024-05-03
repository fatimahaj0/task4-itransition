import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
  try {
    const response = await axios.post("http://localhost:3000/logout");
    if (response.status === 200) {
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    navigate("/register");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

  return <button className="signout" onClick={handleSignOut}>Sign Out</button>;
};
