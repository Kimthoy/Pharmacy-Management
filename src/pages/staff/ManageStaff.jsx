import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ManageStaff.css";
import { Link } from "lucide-react";

const ManageStaff = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-container">
      <h2 className="staff-title">🌸 Manage Staff 🌸</h2>
      <button className="add-staff" onClick={() => navigate("/register")}>
        Add Staff
      </button>

      {loading ? (
        <p className="loading-message">Loading users...</p>
      ) : users.length === 0 ? (
        <div>
          <table className="staff-table">
            <thead className="staff-table-header">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="staff-table-row">
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.is_active ? "active-status" : "inactive-status"
                      }`}
                    >
                      {user.is_active ? "Active" : "InActive"}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit-btn">Edit</button>
                    <button className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="no-data-container">
            <div className="flex-image">
              <img src="not_found.png" width={`300px`} />
            </div>
            <p className="no-data-text">No staff members found.</p>
          </div>
        </div>
      ) : (
        <div className="staff-table-wrapper">
          <table className="staff-table">
            <thead className="staff-table-header">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="staff-table-row">
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.is_active ? "active-status" : "inactive-status"
                      }`}
                    >
                      {user.is_active ? "Active" : "InActive"}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit-btn">Edit</button>
                    <button className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
