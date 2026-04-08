import pool from '../libs/db.js';

class ApplicationRepository {
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
