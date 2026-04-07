import pool from '../../shared/libs/db.js';

class CategoryRepository {
  async findAll() {
    const query = {
      text: 'SELECT * FROM categories ORDER BY created_at DESC',
      values: [],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async create(data) {
    const { name, description } = data;

    const query = {
      text: `INSERT INTO categories (name, description)
             VALUES ($1, $2)
             RETURNING *`,
      values: [name, description],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async update(id, data) {
    const { name, description } = data;

    const query = {
      text: `UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
      values: [name, description, id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING *',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new CategoryRepository();
