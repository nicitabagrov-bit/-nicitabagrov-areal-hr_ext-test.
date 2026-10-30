import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PositionsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/hr_db',
    });
  }

  async findAll() {
    const res = await this.pool.query('SELECT * FROM positions WHERE deleted_at IS NULL');
    return res.rows;
  }

  async create(data: { name: string }) {
    const res = await this.pool.query(
      'INSERT INTO positions (name) VALUES ($1) RETURNING *',
      [data.name],
    );
    return res.rows[0];
  }

  async update(id: string, data: { name?: string }) {
    const res = await this.pool.query(
      'UPDATE positions SET name = COALESCE($1, name), updated_at = now() WHERE id = $2 AND deleted_at IS NULL RETURNING *',
      [data.name, id],
    );
    return res.rows[0];
  }

  async softDelete(id: string) {
    await this.pool.query('UPDATE positions SET deleted_at = now() WHERE id = $1', [id]);
    return { message: 'Position soft deleted' };
  }
}