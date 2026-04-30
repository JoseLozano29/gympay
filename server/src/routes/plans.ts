import { Elysia, t } from "elysia";
import { db } from "../db";

export const plansRoutes = new Elysia({ prefix: "/plans" })
  .get("/", () => {
    return db.query("SELECT * FROM plans ORDER BY price ASC").all();
  })
  .get("/:id", ({ params: { id } }) => {
    const plan = db.query("SELECT * FROM plans WHERE id = ?").get(id);
    if (!plan) throw new Error("Plan not found");
    return plan;
  })
  .post(
    "/",
    ({ body, set }) => {
      // Validación: precio debe ser mayor a cero
      if (body.price <= 0) {
        set.status = 400;
        return { error: "El precio debe ser mayor a cero" };
      }

      // Validación: duración en días debe ser mayor a cero
      if (body.duration_days <= 0) {
        set.status = 400;
        return { error: "La duración en días debe ser mayor a cero" };
      }

      const result = db
        .query(
          "INSERT INTO plans (name, price, duration_days, description) VALUES (?, ?, ?, ?) RETURNING *",
        )
        .get(
          body.name,
          body.price,
          body.duration_days,
          body.description || null,
        );
      return { success: true, data: result };
    },
    {
      body: t.Object({
        name: t.String(),
        price: t.Number(),
        duration_days: t.Number(),
        description: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:id",
    ({ params: { id }, body, set }) => {
      // Validación: precio debe ser mayor a cero
      if (body.price <= 0) {
        set.status = 400;
        return { error: "El precio debe ser mayor a cero" };
      }

      // Validación: duración en días debe ser mayor a cero
      if (body.duration_days <= 0) {
        set.status = 400;
        return { error: "La duración en días debe ser mayor a cero" };
      }

      const result = db
        .query(
          "UPDATE plans SET name = ?, price = ?, duration_days = ?, description = ? WHERE id = ? RETURNING *",
        )
        .get(
          body.name,
          body.price,
          body.duration_days,
          body.description || null,
          id,
        );
      return { success: true, data: result };
    },
    {
      body: t.Object({
        name: t.String(),
        price: t.Number(),
        duration_days: t.Number(),
        description: t.Optional(t.String()),
      }),
    },
  )
  .delete("/:id", ({ params: { id } }) => {
    db.run("DELETE FROM plans WHERE id = ?", [id]);
    return { success: true };
  });