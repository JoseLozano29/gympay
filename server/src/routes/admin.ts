import { Elysia } from "elysia";
import { join } from "path";

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .get("/backup/download", async ({ set }) => {
    const dbPath = join(process.cwd(), "db/db.sqlite");
    const file = Bun.file(dbPath);

    if (!(await file.exists())) {
      set.status = 404;
      return { error: "Base de datos no encontrada" };
    }

    set.headers["Content-Type"] = "application/vnd.sqlite3";
    set.headers["Content-Disposition"] = 'attachment; filename="gympay_backup.sqlite"';
    
    return file;
  });
