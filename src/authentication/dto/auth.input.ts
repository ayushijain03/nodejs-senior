import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@InputType()
export class SignInDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}

@InputType()
export class SignUpDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}

@InputType()
export class AccountVerification {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  code: string;
}
