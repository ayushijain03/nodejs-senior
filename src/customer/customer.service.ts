import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomerInput, UpdateCustomerInput, CreateCustomerInput } from './dto/customer.input';
import { isRoleValid } from 'src/lib/helper/authHelper';



@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  
  async createCustomer(data: CreateCustomerInput) {
    //console.log(data);
    return this.prisma.customer.create({
      data
    });
  }

  
  async getCustomerByIdOrEmail(identifier: string) {
    const userById = await this.prisma.customer.findUnique({
      where: {
        id: identifier, 
      },
    });
  
    const userByEmail = userById ? null : await this.prisma.customer.findUnique({
      where: {
        email: identifier, 
      },
    });
  
    return userById || userByEmail;
  }

  async removeByIdOrEmail(identifier: string) {
      const user = await this.getCustomerByIdOrEmail(identifier);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.prisma.customer.delete({
        where: { id: user.id },
      });
  }

  async updateByIdOrEmail(identifier: string, data: UpdateCustomerInput) {
      const user = await this.getCustomerByIdOrEmail(identifier);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if(data.role && !isRoleValid(data.role)) {
        throw new BadRequestException('Invalid role. Role can be either USER or ADMIN');
      }
      return this.prisma.customer.update({
        where: { id: user.id },
        data
      });
  }
}
