import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SignOut from "./SignOut";
import { useNavigate, Link } from "react-router-dom";
import "./style.css"

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/getUsers")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

useEffect(() => {
  axios
    .get("http://localhost:3000/getUserName", { withCredentials: true })
    .then((response) => {
      if (response.data.username) {
		setUser(response.data.username);
      } else {
        console.error('Error:', response.data.message);
      }
    })
    .catch((err) => console.log(err));
}, []);


  const handleCheckboxChange = (event, user) => {
    if (event.target.checked) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser !== user)
      );
    }
  };
  
 const handleBlock = async () => {
  try {
    for (const user of selectedUsers) {
      const response = await axios.post("http://localhost:3000/blockUser", { userId: user._id });
    }
    setUsers(users.map(user => selectedUsers.includes(user) ? { ...user, status: 'Blocked' } : user));
    setSelectedUsers([]);
  } catch (error) {
    console.error("Error blocking user:", error);
  }
};

const handleUnblock = async () => {
  try {
    for (const user of selectedUsers) {
      const response = await axios.post("http://localhost:3000/unblockUser", { userId: user._id });
    }
    setUsers(users.map(user => selectedUsers.includes(user) ? { ...user, status: 'active' } : user));
    setSelectedUsers([]);
  } catch (error) {
    console.error("Error unblocking user:", error);
  }
};

const handleDelete = async () => {
  try {
    for (const user of selectedUsers) {
      const response = await axios.post("http://localhost:3000/deleteUser", { userId: user._id });
    }
	 setUsers(users.filter(user => !selectedUsers.includes(user)));
    setSelectedUsers([]);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};



  return (
    <div>
      <div className="w-100 vh-100 d-flex flex-column justify-content-center container">
	  <div className="d-flex justify-content-end"> Hello, <span className="signout mx-1"> {user} </span>| <SignOut /></div>
	  <div className = "d-flex justify-content-start align-items-start mb-3">
		<i className="bi bi-lock border p-1 m-1 cursor" onClick={handleBlock}>Block</i>
		<i className="bi bi-unlock border p-1 m-1 cursor" onClick={handleUnblock}></i>
		<i className="bi bi-trash border p-1 m-1 red cursor delete" onClick={handleDelete}></i>

	  </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Username</th>
                <th>Email</th>
                <th> Registration Time</th>
                <th> Last Login Time</th>
				 <th> Status </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user)}
                      onChange={(event) => handleCheckboxChange(event, user)}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.registrationTime}</td>
                  <td>{user.lastLoginTime}</td>
				   <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}