import { NewRole, RoleTable } from "@/users/users.entities";
import { db } from "../db";

async function seed() {
  await db.delete(RoleTable);

  const roles: NewRole[] = ["super_admin", "admin", "user"].map((item) => ({
    name: item,
    role: item as any,
  }));

  await db.insert(RoleTable).values(roles);
}

seed().catch((e) => {
  console.log("seed failed", e);
  process.exit(1);
});
