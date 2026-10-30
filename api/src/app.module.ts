import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { OrganizationsModule } from './organizations/organizations.module.js';
import { DepartmentsModule } from './departments/departments.module.js';
import { PositionsModule } from './positions/positions.module.js';

@Module({
  imports: [
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule, // <- добавить
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}