import pool from '../../shared/libs/db.js';

class CompanyRepository {
  async findAll() {
    const query = {
      text: 'SELECT * FROM companies ORDER BY created_at DESC',
      values: [],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: 'SELECT * FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async create(data) {
    const { name, description, website, logoUrl, location, industry } = data;

    const query = {
      text: `INSERT INTO companies (name, description, website, logo_url, location, industry)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
      values: [name, description, website, logoUrl, location, industry],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async update(id, data) {
    const { name, description, website, logoUrl, location, industry } = data;

    const query = {
      text: `UPDATE companies SET name = $1, description = $2, website = $3, logo_url = $4, location = $5, industry = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
      values: [name, description, website, logoUrl, location, industry, id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING *',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new CompanyRepository();
