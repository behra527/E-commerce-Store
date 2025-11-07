import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import './User.css'; // We'll add custom animations here

const firebaseURL = 'https://dexter-e4919-default-rtdb.firebaseio.com';

function User() {
  const [users, setUsers] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${firebaseURL}/users.json`);
      setUsers(res.data || {});
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      showClass: {
        popup: 'swal2-show swal2-animate-pop-in',
      },
      hideClass: {
        popup: 'swal2-hide swal2-animate-pop-out',
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${firebaseURL}/users/${userId}.json`);
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete user.', 'error');
      }
    }
  };

  const handleToggleDisable = async (userId) => {
    const user = users[userId];
    const action = user?.disabled ? 'Enable' : 'Disable';

    const result = await Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action.toLowerCase()} this user?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${firebaseURL}/users/${userId}.json`, {
          disabled: !user.disabled,
        });
        Swal.fire('Updated!', `User has been ${action.toLowerCase()}d.`, 'success');
        fetchUsers();
      } catch (err) {
        Swal.fire('Error!', 'Failed to update user.', 'error');
      }
    }
  };

  return (
    <div className="container mt-5 user-container animate-fade-in">
      <h2 className="text-center mb-4 text-primary fw-bold">👥 User Management Panel</h2>
      <div className="table-responsive shadow rounded overflow-hidden">
        <table className="table table-hover table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr className="text-center">
              <th>#</th>
              <th>Picture</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(users).map(([id, user], index) => (
              <tr key={id} className="text-center">
                <td>{index + 1}</td>
                <td>
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt="avatar"
                      className="rounded-circle border"
                      width="50"
                      height="50"
                    />
                  ) : (
                    <div className="bg-secondary rounded-circle" style={{ width: 50, height: 50 }} />
                  )}
                </td>
                <td className="fw-semibold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.disabled ? 'bg-danger' : 'bg-success'}`}>
                    {user.disabled ? 'Disabled' : 'Active'}
                  </span>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className={`btn btn-sm ${user.disabled ? 'btn-success' : 'btn-warning'} btn-animated`}
                      onClick={() => handleToggleDisable(id)}
                    >
                      {user.disabled ? 'Enable' : 'Disable'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger btn-animated"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {Object.keys(users).length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
