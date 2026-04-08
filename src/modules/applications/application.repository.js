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

  async findNotificationPayloadById(id) {
    const query = {
      text: `SELECT
               a.id AS application_id,
               a.created_at AS application_created_at,
               applicant.name AS applicant_name,
               applicant.email AS applicant_email,
               COALESCE(job_owner.email, company_owner.email) AS owner_email
             FROM applications a
             JOIN users applicant ON applicant.id = a.user_id
             JOIN jobs j ON j.id = a.job_id
             LEFT JOIN users job_owner ON job_owner.id = j.owner_user_id
             LEFT JOIN companies c ON c.id = j.company_id
             LEFT JOIN users company_owner ON company_owner.id = c.owner_user_id
             WHERE a.id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new ApplicationRepository();
