/* eslint-disable camelcase */
import pool from '../../shared/libs/db.js';

class JobRepository {
  async findAll(titleQuery, companyNameQuery) {
    const filters = [];
    const params = [];

    if (titleQuery) {
      params.push(`%${titleQuery}%`);
      filters.push(`j.title ILIKE $${params.length}`);
    }

    if (companyNameQuery) {
      params.push(`%${companyNameQuery}%`);
      filters.push(`c.name ILIKE $${params.length}`);
    }

    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const query = {
      text: [
        `SELECT j.*, c.name as company_name, cat.name as category_name
         FROM jobs j
         JOIN companies c ON j.company_id = c.id
         JOIN categories cat ON j.category_id = cat.id`,
        whereClause,
        'ORDER BY j.created_at DESC',
      ]
        .filter(Boolean)
        .join('\n'),
      values: params,
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT j.*, c.name as company_name, cat.name as category_name
             FROM jobs j
             JOIN companies c ON j.company_id = c.id
             JOIN categories cat ON j.category_id = cat.id
             WHERE j.id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async findByCompanyId(companyId) {
    const query = {
      text: `SELECT j.*, c.name as company_name, cat.name as category_name
             FROM jobs j
             JOIN companies c ON j.company_id = c.id
             JOIN categories cat ON j.category_id = cat.id
             WHERE j.company_id = $1
             ORDER BY j.created_at DESC`,
      values: [companyId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findByCategoryId(categoryId) {
    const query = {
      text: `SELECT j.*, c.name as company_name, cat.name as category_name
             FROM jobs j
             JOIN companies c ON j.company_id = c.id
             JOIN categories cat ON j.category_id = cat.id
             WHERE j.category_id = $1
             ORDER BY j.created_at DESC`,
      values: [categoryId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async create(data) {
    const {
      company_id,
      category_id,
      title,
      description,
      requirements,
      salary_min,
      salary_max,
      job_type,
      experience_level,
      location_type,
      location_city,
      is_salary_visible,
      status,
      owner_user_id,
    } = data;

    const query = {
      text: `INSERT INTO jobs (company_id, category_id, title, description, requirements, salary_min, salary_max, job_type, experience_level, location_type, location_city, is_salary_visible, status, owner_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      values: [
        company_id,
        category_id,
        title,
        description,
        requirements,
        salary_min,
        salary_max,
        job_type,
        experience_level,
        location_type,
        location_city,
        is_salary_visible ?? false,
        status,
        owner_user_id,
      ],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async update(id, data) {
    const {
      company_id,
      category_id,
      title,
      description,
      requirements,
      salary_min,
      salary_max,
      job_type,
      experience_level,
      location_type,
      location_city,
      is_salary_visible,
      status,
      owner_user_id,
    } = data;

    const query = {
      text: `UPDATE jobs SET company_id = $1, category_id = $2, title = $3, description = $4, requirements = $5, salary_min = $6, salary_max = $7, job_type = $8, experience_level = $9, location_type = $10, location_city = $11, is_salary_visible = $12, status = $13, owner_user_id = $14, updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      values: [
        company_id,
        category_id,
        title,
        description,
        requirements,
        salary_min,
        salary_max,
        job_type,
        experience_level,
        location_type,
        location_city,
        is_salary_visible,
        status,
        owner_user_id,
        id,
      ],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING *',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new JobRepository();
