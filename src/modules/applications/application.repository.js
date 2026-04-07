/* eslint-disable camelcase */
import pool from '../../shared/libs/db.js';

class ApplicationRepository {
  async findAll() {
    const query = {
      text: `SELECT id, user_id, job_id, status, cover_letter, created_at, updated_at
             FROM applications
             ORDER BY created_at DESC`,
      values: [],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT id, user_id, job_id, status, cover_letter, created_at, updated_at
             FROM applications
             WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async findByUserId(userId) {
    const query = {
      text: `SELECT id, user_id, job_id, status, cover_letter, created_at, updated_at
             FROM applications
             WHERE user_id = $1
             ORDER BY created_at DESC`,
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findByJobId(jobId) {
    const query = {
      text: `SELECT id, user_id, job_id, status, cover_letter, created_at, updated_at
             FROM applications
             WHERE job_id = $1
             ORDER BY created_at DESC`,
      values: [jobId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findByUserAndJob(userId, jobId) {
    const query = {
      text: `SELECT id, user_id, job_id, status, cover_letter, created_at, updated_at
             FROM applications
             WHERE user_id = $1 AND job_id = $2`,
      values: [userId, jobId],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async create(data) {
    const { user_id, job_id, status, cover_letter } = data;

    const query = {
      text: `INSERT INTO applications (user_id, job_id, status, cover_letter)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, job_id, status, cover_letter, created_at, updated_at`,
      values: [user_id, job_id, status, cover_letter || null],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async updateStatus(id, status) {
    const query = {
      text: `UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, user_id, job_id, status, cover_letter, created_at, updated_at`,
      values: [status, id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new ApplicationRepository();
