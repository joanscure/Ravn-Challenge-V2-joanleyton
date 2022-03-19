import {Role} from "@prisma/client";

export class UserFactoryDto {
  username?: string;

  password?: string;

  email?: string;

  firstName?: string;

  lastName?: string;

  role?: Role;
}
