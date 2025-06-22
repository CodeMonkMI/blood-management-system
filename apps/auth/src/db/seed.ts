import { NewRole, RoleTable } from "@/auth/auth.entities";
import { db } from ".";

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
