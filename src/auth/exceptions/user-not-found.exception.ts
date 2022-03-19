import { ConflictException } from '@nestjs/common';

class WrongPasswordException extends ConflictException {
  constructor() {
    super(`Wrong username/password provided`);
  }
}

export default WrongPasswordException;
