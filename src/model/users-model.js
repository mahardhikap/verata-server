const pool = require("../config/db");

const postRegister = async (data) => {
  return new Promise((resolve, reject) => {
    const { id, username, password, roles } = data;
    const query =
      "INSERT INTO users (id, username, password, roles) VALUES (?, ?, ?, ?)";
    const values = [id, username, password, roles];
    pool.query(query, values, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getUserByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE username = ?";
    pool.query(query, [username], (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getUserById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE id = ?";
    pool.query(query, [id], (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getUsers = async () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users";
    pool.query(query, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const deleteUserById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM users WHERE id = ?";
    pool.query(query, [id], (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const updateUserById = async (data) => {
  return new Promise((resolve, reject) => {
    const { id, username, password } = data;
    const query =
      "UPDATE users SET username = ?, password = ? WHERE id = ?";
    const values = [username, password, id];
    pool.query(query, values, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  postRegister,
  getUserByUsername,
  getUserById,
  getUsers,
  deleteUserById,
  updateUserById
};
