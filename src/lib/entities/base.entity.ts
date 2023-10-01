import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class Base {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Date and time when object was created.' })
  createdAt: Date;

  @Field({
    description: 'Date and time when the object was updated last time.',
  })
  updatedAt: Date;

  @Field({
    description: 'Holds the account activation code',
  })
  activationCode: string;

  @Field({
    description: 'Stores true if the account is verified otherwise false',
  })
  isVerified: boolean;

  @Field({
    description: 'Holds the refresh token',
  })
  refreshToken: string;
}
