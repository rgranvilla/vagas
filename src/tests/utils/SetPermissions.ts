import { IDatabaseRepository } from "@database/IDatabaseRepository";

interface SetPermissionsProps {
  repo: IDatabaseRepository;
  userId: number;
  isAdmin?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}
export async function SetPermissions({
  repo,
  userId,
  isAdmin = false,
  canUpdate = false,
  canDelete = false,
}: SetPermissionsProps) {
  const user = await repo.getUserById(userId);
  if (user) {
    user.isAdmin = isAdmin;
    user.permissions.canUpdate = canUpdate;
    user.permissions.canDelete = canDelete;

    await repo.updateUserPermissions(userId, user);
  }
}
