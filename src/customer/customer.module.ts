import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerResolver } from './customer.resolver';

@Module({
  imports: [],
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver],
  exports: [CustomerService],
})
export class CustomerModule {}
