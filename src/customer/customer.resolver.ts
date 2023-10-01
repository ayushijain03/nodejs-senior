import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import {
  GetCustomerInput,
  CreateCustomerInput,
  UpdateCustomerInput,
} from './dto/customer.input';
import { RoleGuard } from 'src/lib/guards/role.guard';
import { RoleType } from 'src/lib/decorators/role.decorator';
import { GqlAuthGuard } from 'src/lib/guards/gql-auth.guard';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  @UseGuards(GqlAuthGuard)
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Mutation(() => Customer)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @RoleType('ADMIN')
  async createCustomer(
    @Args('data') { email, password, role }: CreateCustomerInput,
  ) {
    return this.customerService.createCustomer({ email, password, role });
  }

  @Query(() => Customer)
  @UseGuards(GqlAuthGuard)
  async getCustomer(@Args('data') where: string) {
    return this.customerService.getCustomerByIdOrEmail(where);
  }

  @Mutation(() => Customer)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @RoleType('ADMIN')
  async removeCustomer(@Args('data') where: string) {
    return this.customerService.removeByIdOrEmail(where);
  }

  @Mutation(() => Customer)
  @UseGuards(GqlAuthGuard, RoleGuard)
  @RoleType('ADMIN')
  async updateCustomer(
    @Args('data') where: string,
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
  ) {
    return this.customerService.updateByIdOrEmail(where, updateCustomerInput);
  }
}
