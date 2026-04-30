import { Elysia, t } from "elysia";
import { db } from "../db";

export const settingsRoutes = new Elysia({ prefix: "/settings" })
  .get("/", () => {
    return db.query("SELECT * FROM settings").all();
  })
  .post(
    "/",
    ({ body }) => {
      db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [
        body.key,
        body.value,
      ]);
      return { success: true };
    },
    {
      body: t.Object({
        key: t.String(),
        value: t.String(),
      }),
    },
  );
