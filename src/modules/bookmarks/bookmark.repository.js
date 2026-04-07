import pool from '../../shared/libs/db.js';

class BookmarkRepository {
  async findById(id) {
    const query = {
      text: `SELECT id, user_id, job_id, created_at
             FROM bookmarks
             WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async findByUserId(userId) {
    const query = {
      text: `SELECT id, user_id, job_id, created_at
             FROM bookmarks
             WHERE user_id = $1
             ORDER BY created_at DESC`,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findByUserAndJob(userId, jobId) {
    const query = {
      text: `SELECT id, user_id, job_id, created_at
             FROM bookmarks
             WHERE user_id = $1 AND job_id = $2`,
      values: [userId, jobId],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async create(userId, jobId) {
    const query = {
      text: `INSERT INTO bookmarks (user_id, job_id)
             VALUES ($1, $2)
             RETURNING id, user_id, job_id, created_at`,
      values: [userId, jobId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async deleteByUserAndJob(userId, jobId) {
    const query = {
      text: `DELETE FROM bookmarks
             WHERE user_id = $1 AND job_id = $2
             RETURNING id`,
      values: [userId, jobId],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new BookmarkRepository();
