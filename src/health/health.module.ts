import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { PrismaClient } from '@prisma/client';
import { HealthService } from './health.service'; // import HealthService

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [PrismaClient, HealthService], // add HealthService to providers
})
export class HealthModule {}
