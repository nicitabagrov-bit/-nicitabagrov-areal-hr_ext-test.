import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DepartmentsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/hr_db',
    });
  }

  async findAll() {
    const res = await this.pool.query('SELECT * FROM departments WHERE deleted_at IS NULL');
    return res.rows;
  }

   async create(data: { name: string; comment?: string; organization_id: string }) {
    const res = await this.pool.query(
      'INSERT INTO departments (name, comment, organization_id) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.comment, data.organization_id],
    );
    return res.rows[0];
  }

  async update(id: string, data: { name?: string; comment?: string; organization_id?: string; parent_id?: string }) {
    const res = await this.pool.query(
      'UPDATE departments SET name = COALESCE($1, name), comment = COALESCE($2, comment), organization_id = COALESCE($3, organization_id), parent_id = COALESCE($4, parent_id), updated_at = now() WHERE id = $5 AND deleted_at IS NULL RETURNING *',
      [data.name, data.comment, data.organization_id, data.parent_id, id],
    );
    return res.rows[0];
  }

  async softDelete(id: string) {
    await this.pool.query('UPDATE departments SET deleted_at = now() WHERE id = $1', [id]);
    return { message: 'Department soft deleted' };
  }
}