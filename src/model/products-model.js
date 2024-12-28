const pool = require("../config/db");

const postProduct = async (data) => {
  return new Promise((resolve, reject) => {
    const { id, product, disc, description, price, image, stock, category_id } =
      data;
    const query =
      "INSERT INTO products (id, product, disc, description, price, image, stock, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      id,
      product,
      disc,
      description,
      price,
      JSON.stringify(image),
      stock ? 1 : 0,
      category_id,
    ];
    pool.query(query, values, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getProducts = async () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM products";
    pool.query(query, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getProductById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM products WHERE id = ?";
    pool.query(query, [id], (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const updateProductById = async (data) => {
  return new Promise((resolve, reject) => {
    const { id, product, disc, description, price, image, stock, category_id } =
      data;
    const query =
      "UPDATE products SET product = ?, disc = ?, description = ?, price = ?, image = ?, stock = ?, category_id = ? WHERE id = ?";
    const values = [
      product,
      disc,
      description,
      price,
      JSON.stringify(image),
      stock ? 1 : 0,
      category_id,
      id,
    ];
    pool.query(query, values, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const deleteProductById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM products WHERE id = ?";
    pool.query(query, [id], (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const getProductCount = async (data) => {
  return new Promise((resolve, reject) => {
    const { searchby, search } = data;
    const validSearchBy = [
      "product",
      "disc",
      "description",
      "price",
      "stock",
      "created_at",
    ];

    if (searchby === "category") {
      const query = `
        SELECT COUNT(*) AS count 
        FROM products p 
        JOIN categories c ON c.id = p.category_id 
        WHERE c.name LIKE ?`;
      const values = [`%${search}%`];
      
      pool.query(query, values, (err, result) => {
        if (!err) {
          resolve(result[0].count);
        } else {
          reject(err);
        }
      });
    } else if (validSearchBy.includes(searchby)) {
      const query = `SELECT COUNT(*) AS count 
                     FROM products p 
                     WHERE ?? LIKE ?`;
      const values = [searchby, `%${search}%`];

      pool.query(query, values, (err, result) => {
        if (!err) {
          resolve(result[0].count);
        } else {
          reject(err);
        }
      });
    } else {
      return reject(new Error("Invalid search field"));
    }
  });
};

const getFilterProduct = async (data) => {
  return new Promise((resolve, reject) => {
    const { searchby, search, sortby, sort, offset, limit } = data;
    const validSortBy = [
      "product",
      "disc",
      "description",
      "price",
      "stock",
      "created_at",
    ];
    const validSortOrder = ["ASC", "DESC"];

    if (
      !validSortBy.includes(sortby) ||
      !validSortOrder.includes(sort.toUpperCase())
    ) {
      return reject(new Error("Invalid sort parameters"));
    }

    let query = `
            SELECT p.id, p.product, p.disc, p.description, p.price, p.image, p.stock, c.name as category, p.created_at
            FROM products p 
            JOIN categories c ON c.id = p.category_id 
            WHERE 1=1`;

    const values = [];

    if (searchby === "category") {
      query += ` AND c.name LIKE ?`;
      values.push(`%${search}%`);
    } else if (validSortBy.includes(searchby)) {
      query += ` AND ?? LIKE ?`;
      values.push(searchby, `%${search}%`);
    }

    query += ` ORDER BY ?? ${sort.toUpperCase()} LIMIT ? OFFSET ?`;
    values.push(sortby, limit, offset);

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
  postProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductCount,
  getFilterProduct,
};
