const pool = require("../config/db");

const postCategory = async (data) => {
  return new Promise((resolve, reject) => {
    const { id, name } = data;
    const query = "INSERT INTO categories (id, name) VALUES (?, ?)";
    const values = [id, name];
    pool.query(query, values, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getCategories = async () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM categories";
    pool.query(query, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getCategoryById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM categories WHERE id = ?";
    pool.query(query, [id], (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const updateCategoryById = async (data) => {
  return new Promise((resolve, reject) => {
    const { id, name } = data;
    const query = "UPDATE categories SET name = ? WHERE id = ?";
    const values = [name, id];
    pool.query(query, values, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const deleteCategoryById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM categories WHERE id = ?";
    pool.query(query, [id], (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

module.exports = {
  postCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
