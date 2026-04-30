import { Elysia, t } from "elysia";
import { db } from "../db";

export const notificationsRoutes = new Elysia({ prefix: "/notifications" })
  .get("/", () => {
    return db
      .query("SELECT * FROM notifications ORDER BY created_at DESC")
      .all();
  })
  .post(
    "/",
    ({ body }) => {
      const result = db
        .query(
          "INSERT INTO notifications (client_id, title, message) VALUES (?, ?, ?) RETURNING *",
        )
        .get(body.client_id || null, body.title, body.message);
      return { success: true, data: result };
    },
    {
      body: t.Object({
        client_id: t.Optional(t.Number()),
        title: t.String(),
        message: t.String(),
      }),
    },
  )
  .put("/:id/read", ({ params: { id } }) => {
    db.run("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    return { success: true };
  });
