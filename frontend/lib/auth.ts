import { betterAuth } from "better-auth";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  (process.env.NODE_ENV === "production" || process.env.INTERNAL_API_URL
    ? "postgresql://task_pilot_db_user:task_pilot_db_password@task-pilot-db:5432/task_pilot_db"
    : "postgresql://task_pilot_db_user:task_pilot_db_password@localhost:5432/task_pilot_db");

export const pool = new Pool({
  connectionString,
});

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "taskpilot-better-auth-secret-key-32charsmin",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // Auto-provision Admin entity for TaskPilot project management
            await pool.query(
              `INSERT INTO "Admin" (
                "id", "name", "email", "role", "createdAt",
                "remainingProjectLimit", "remainginEmployeeLimit",
                "remainingDocumentLimit", "remainingResearchLimit", "dailyResearchLimit"
              ) VALUES ($1, $2, $3, 'admin', NOW(), 100, 100, 100, 100, 100)
              ON CONFLICT ("email") DO UPDATE SET
                "id" = EXCLUDED."id",
                "name" = EXCLUDED."name";`,
              [user.id, user.name, user.email]
            );

            // Also provision free subscription if not exists
            const existingSub = await pool.query(
              `SELECT "id" FROM "Subscription" WHERE "adminId" = $1;`,
              [user.id]
            );

            if (existingSub.rows.length === 0) {
              const subId = crypto.randomUUID();
              const now = new Date();
              const future = new Date(now);
              future.setFullYear(future.getFullYear() + 10);

              await pool.query(
                `INSERT INTO "Subscription" ("id", "adminId", "planId", "status", "startDate", "endDate")
                 VALUES ($1, $2, 'free', 'active', $3, $4);`,
                [subId, user.id, now, future]
              );

              await pool.query(
                `UPDATE "Admin" SET "subscriptionId" = $1 WHERE "id" = $2;`,
                [subId, user.id]
              );
            }
          } catch (err) {
            console.error("Error provisioning Admin/Subscription in hook:", err);
          }
        },
      },
    },
  },
});
