import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@InputType()
export class WhereCustomerInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

@InputType()
export class GetCustomerInput {
  @Field(() => String, { nullable: true })
  cursor?: Prisma.CustomerWhereUniqueInput;

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number;

  @Field(() => WhereCustomerInput, { nullable: true })
  where: WhereCustomerInput;
}

@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => String, { nullable: true })
  activationCode?: string;
}

@InputType()
export class GetCustomerByIdOrEmail {
  @Field(() => String, { nullable: true })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  id?: string;
}

@InputType()
export class UpdateCustomerInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => String, { nullable: true })
  activationCode?: string;

  @Field(() => Boolean, { nullable: true })
  isVerified?: boolean;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
