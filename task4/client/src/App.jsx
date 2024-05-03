
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from './ProtectedRoutes';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignOut from "./SignOut";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<SignUp />}></Route>
        <Route path="/login" element={<SignIn />}></Route>
		 <Route path="/logout" element={<SignOut />}></Route>
        <Route path="/" element={<ProtectedRoute component={AdminPanel} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
