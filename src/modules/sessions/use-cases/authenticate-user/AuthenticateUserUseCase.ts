import auth from "@config/auth";
import { IDatabaseRepository } from "@database";
import { InvalidCredentialsError } from "@errors/InvalidCredentialsError";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(name: string, password: string) {
    const user = await this.repository.getUser(name);

    const { secret_token, expires_in_token } = auth;

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign({ isAdmin: user.isAdmin }, secret_token, {
      expiresIn: expires_in_token,
      subject: user.id.toString(),
    });

    return token;
  }
}
