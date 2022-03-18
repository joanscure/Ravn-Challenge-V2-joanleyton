import { ConflictException } from '@nestjs/common';

class UserAlreadyExistsException extends ConflictException {
  constructor(singleField: string) {
    super(`User already exists with same ${singleField}`);
  }
}

export default UserAlreadyExistsException;
