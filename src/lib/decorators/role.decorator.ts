import { SetMetadata } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'RoleType',
});

export const RoleType = (role: Role) => SetMetadata('role', role);
