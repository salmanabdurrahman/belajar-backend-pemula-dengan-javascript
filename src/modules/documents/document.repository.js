import pool from '../../shared/libs/db.js';

class DocumentRepository {
  async findAll() {
    const query = {
      text: `SELECT id, user_id, file_name, file_path, mime_type, file_size, created_at, updated_at
             FROM documents
             ORDER BY created_at DESC`,
      values: [],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT id, user_id, file_name, file_path, mime_type, file_size, created_at, updated_at
             FROM documents
             WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async create(data) {
    const { userId, fileName, filePath, mimeType, fileSize } = data;

    const query = {
      text: `INSERT INTO documents (user_id, file_name, file_path, mime_type, file_size)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, user_id, file_name, file_path, mime_type, file_size, created_at, updated_at`,
      values: [userId, fileName, filePath, mimeType, fileSize],
    };

    const result = await pool.query(query);

    return result.rows[0];
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0] || null;
  }
}

export default new DocumentRepository();
