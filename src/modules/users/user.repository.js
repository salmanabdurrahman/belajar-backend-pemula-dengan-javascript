import pool from '../../shared/libs/db.js';

class UserRepository {
  async findByEmail(email) {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async findById(id) {
    const query = {
      text: `SELECT id, email, name, role, phone_number, profile_picture_url, bio, created_at, updated_at
             FROM users
             WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async create(data) {
    const { email, password, name, phoneNumber, role } = data;

    const query = {
      text: `INSERT INTO users (email, password, name, role, phone_number)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, name, role, phone_number, created_at, updated_at`,
      values: [email, password, name, role || 'user', phoneNumber || null],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async update(id, data) {
    const { name, phoneNumber, bio, profilePictureUrl } = data;

    const query = {
      text: `UPDATE users
             SET name = $1, phone_number = $2, bio = $3, profile_picture_url = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING id, email, name, role, phone_number, profile_picture_url, bio, created_at, updated_at`,
      values: [name, phoneNumber, bio, profilePictureUrl, id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new UserRepository();
