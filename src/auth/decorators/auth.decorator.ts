import { SetMetadata } from '@nestjs/common';

export const Auth = (...args: string[]) => SetMetadata('auth', args);

export enum Role {
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  SUBSCRIBER = 'SUBSCRIBER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
