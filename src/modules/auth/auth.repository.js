import pool from '../../shared/libs/db.js';

class AuthRepository {
  async addRefreshToken(token, userId) {
    const query = {
      text: `INSERT INTO refresh_tokens (token, user_id)
             VALUES ($1, $2)
             RETURNING id, token, user_id, created_at`,
      values: [token, userId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async findRefreshToken(token) {
    const query = {
      text: 'SELECT id, token, user_id, created_at FROM refresh_tokens WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM refresh_tokens WHERE token = $1 RETURNING id',
      values: [token],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new AuthRepository();
