import { IDatabaseRepository } from "@database/IDatabaseRepository";
import { passwordHashing } from "@utils/passwordHashing";

interface OverrideProps {
  name: string;
  password: string;
  job: string;
}

interface CreateNewUserProps {
  repo: IDatabaseRepository;
  override?: OverrideProps;
}

export async function CreateNewUser({ repo, override }: CreateNewUserProps) {
  const newUser = {
    name: override?.name ?? "John Doe",
    password:
      (override?.password && (await passwordHashing(override?.password))) ??
      (await passwordHashing("12345678")),
    job: override?.job ?? "Tester",
  };

  const createdUser = await repo.createUser(newUser);

  return createdUser;
}
