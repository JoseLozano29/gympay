import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";
import { clientsRoutes } from "./routes/clients";
import { plansRoutes } from "./routes/plans";
import { membershipsRoutes } from "./routes/memberships";
import { paymentsRoutes } from "./routes/payments";
import { attendanceRoutes } from "./routes/attendance";
import { notificationsRoutes } from "./routes/notifications";
import { invoicesRoutes } from "./routes/invoices";
import { settingsRoutes } from "./routes/settings";
import { jwtPlugin } from "./plugins/jwt";
import { adminRoutes } from "./routes/admin";
import { db } from "./db";

const app = new Elysia()
  .use(cors())
  .use(jwtPlugin)
  .use(authRoutes)
  .group("/api", (app) =>
    app
      .onBeforeHandle(async ({ jwt, headers, set, path }) => {
        const auth = headers["authorization"];
        if (!auth) {
          set.status = 401;
          return { error: "No autorizado: Token faltante" };
        }

        const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

        // Blacklist check
        const isRevoked = db
          .query("SELECT 1 FROM revoked_tokens WHERE token = ?")
          .get(token);
        
        if (isRevoked) {
          set.status = 401;
          return { error: "No autorizado: Token invalidado (Sesión cerrada)" };
        }

        const profile = await jwt.verify(token);


        if (!profile) {
          set.status = 401;
          return { error: "No autorizado: Token inválido" };
        }

        // Admin check for /admin/* routes
        if (path.startsWith("/api/admin") && profile.role !== "admin") {
          set.status = 403;
          return { error: "Acceso denegado: Se requiere rol de administrador" };
        }
      })
      .use(clientsRoutes)
      .use(plansRoutes)
      .use(membershipsRoutes)
      .use(paymentsRoutes)
      .use(attendanceRoutes)
      .use(notificationsRoutes)
      .use(invoicesRoutes)
      .use(settingsRoutes)
      .use(adminRoutes),
  )

  .use(
    staticPlugin({
      assets: "../client/dist",
      prefix: "/",
    }),
  )
  .get("*", () => Bun.file("../client/dist/index.html"))
  .listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
