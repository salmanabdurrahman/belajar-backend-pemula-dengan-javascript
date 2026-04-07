/* eslint-disable camelcase */
import pool from '../../shared/libs/db.js';

const JOB_WITH_RELATIONS_FIELDS =
  'j.*, c.name as company_name, cat.name as category_name';

const JOB_WITH_RELATIONS_FROM = `FROM jobs j
JOIN companies c ON j.company_id = c.id
JOIN categories cat ON j.category_id = cat.id`;

const SELECT_JOBS_WITH_RELATIONS_QUERY = `SELECT ${JOB_WITH_RELATIONS_FIELDS}
${JOB_WITH_RELATIONS_FROM}`;

const ORDER_BY_JOB_CREATED_DESC = 'ORDER BY j.created_at DESC';

const FIND_JOB_BY_ID_QUERY = `${SELECT_JOBS_WITH_RELATIONS_QUERY}
WHERE j.id = $1`;

const FIND_JOBS_BY_COMPANY_ID_QUERY = `${SELECT_JOBS_WITH_RELATIONS_QUERY}
WHERE j.company_id = $1
${ORDER_BY_JOB_CREATED_DESC}`;

const FIND_JOBS_BY_CATEGORY_ID_QUERY = `${SELECT_JOBS_WITH_RELATIONS_QUERY}
WHERE j.category_id = $1
${ORDER_BY_JOB_CREATED_DESC}`;

const INSERT_JOB_QUERY = `INSERT INTO jobs (company_id, category_id, title, description, requirements, salary_min, salary_max, job_type, experience_level, location_type, location_city, is_salary_visible, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
RETURNING *`;

const UPDATE_JOB_QUERY = `UPDATE jobs SET company_id = $1, category_id = $2, title = $3, description = $4, requirements = $5, salary_min = $6, salary_max = $7, job_type = $8, experience_level = $9, location_type = $10, location_city = $11, is_salary_visible = $12, status = $13, updated_at = CURRENT_TIMESTAMP
WHERE id = $14
RETURNING *`;

const DELETE_JOB_QUERY = 'DELETE FROM jobs WHERE id = $1 RETURNING *';

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
    const queryText = [
      SELECT_JOBS_WITH_RELATIONS_QUERY,
      whereClause,
      ORDER_BY_JOB_CREATED_DESC,
    ]
      .filter(Boolean)
      .join('\n');

    const query = {
      text: queryText,
      values: params,
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: FIND_JOB_BY_ID_QUERY,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async findByCompanyId(companyId) {
    const query = {
      text: FIND_JOBS_BY_COMPANY_ID_QUERY,
      values: [companyId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findByCategoryId(categoryId) {
    const query = {
      text: FIND_JOBS_BY_CATEGORY_ID_QUERY,
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
    } = data;

    const query = {
      text: INSERT_JOB_QUERY,
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
    } = data;

    const query = {
      text: UPDATE_JOB_QUERY,
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
        id,
      ],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = {
      text: DELETE_JOB_QUERY,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new JobRepository();
