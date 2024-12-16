import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './health.service'; // import HealthService

@Controller('health')
export class HealthController {
  constructor(
    private healthService: HealthService, // inject HealthService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check(); // delegate to HealthService
  }
}
