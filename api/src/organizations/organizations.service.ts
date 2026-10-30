import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class OrganizationsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/hr_db',
    });
  }

  async findAll() {
    const res = await this.pool.query('SELECT * FROM organizations WHERE deleted_at IS NULL');
    return res.rows;
  }

  async create(data: { name: string; comment?: string }) {
    const res = await this.pool.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *',
      [data.name, data.comment],
    );
    return res.rows[0];
  }

  async update(id: string, data: { name?: string; comment?: string }) {
    const res = await this.pool.query(
      'UPDATE organizations SET name = COALESCE($1, name), comment = COALESCE($2, comment), updated_at = now() WHERE id = $3 AND deleted_at IS NULL RETURNING *',
      [data.name, data.comment, id],
    );
    return res.rows[0];
  }

  async softDelete(id: string) {
    await this.pool.query('UPDATE organizations SET deleted_at = now() WHERE id = $1', [id]);
    return { message: 'Organization soft deleted' };
  }
}