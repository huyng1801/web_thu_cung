const API_URL = 'http://localhost:3000/api/users';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to get users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },
  // Phương thức để lấy thông tin của một người dùng dựa trên userId
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  addUser: async (user) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  updateUser: async (userId, user) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

const renderUsers = async () => {
  try {
    const users = await userService.getAllUsers();
    displayUsers(users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const displayUsers = (users) => {
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = '';
  users.forEach(user => {
    const row = `
      <tr>
        <td>${user.user_id}</td>
        <td>${user.user_name}</td>
        <td>${user.email}</td>
        <td>${user.phone_number}</td>
        <td>
          <button class="btn btn-primary btn-sm edit-btn" onclick="handleEdit('${user.user_id}')">Sửa</button>
          <button class="btn btn-danger btn-sm delete-btn" onclick="handleDeleteConfirmation('${user.user_id}')">Xóa</button>
        </td>
      </tr>
    `;
    userTableBody.innerHTML += row;
  });
};

const addUserForm = document.getElementById('addUserForm');
addUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('userId').value;
  const userName = document.getElementById('userName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const password = document.getElementById('password').value;
  try {
    await userService.addUser({ user_id: userId, user_name: userName, email, phone_number: phoneNumber, password });
    $('#addUserModal').modal('hide');
    renderUsers();
  } catch (error) {
    console.error('Error adding user:', error);
  }
});

const updateUserForm = document.getElementById('editUserForm');
updateUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('editUserId').value;
  const userName = document.getElementById('editUserName').value;
  const email = document.getElementById('editEmail').value;
  const phoneNumber = document.getElementById('editPhoneNumber').value;
  try {
    await userService.updateUser(userId, { user_name: userName, email, phone_number: phoneNumber });
    $('#editUserModal').modal('hide');
    renderUsers();
  } catch (error) {
    console.error('Error updating user:', error);
  }
});

const handleEdit = async (userId) => {
  try {
    const user = await userService.getUserById(userId);
    document.getElementById('editUserId').value = user.user_id;
    document.getElementById('editUserName').value = user.user_name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhoneNumber').value = user.phone_number;
    $('#editUserModal').modal('show');
  } catch (error) {
    console.error('Error fetching user for edit:', error);
  }
};

const handleDeleteConfirmation = (userId) => {
  // Hiển thị modal xác nhận xóa và chờ người dùng xác nhận
  $('#deleteUserModal').modal('show');
  // Lưu user_id vào thuộc tính data của nút xác nhận xóa
  const confirmDeleteButton = document.getElementById('confirmDeleteButton');
  confirmDeleteButton.dataset.userId = userId;
};

const confirmDeleteButton = document.getElementById('confirmDeleteButton');
confirmDeleteButton.addEventListener('click', async () => {
  const userId = confirmDeleteButton.dataset.userId;
  try {
    await userService.deleteUser(userId);
    $('#deleteUserModal').modal('hide');
    renderUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
});

window.onload = renderUsers;
