import { Elysia, t } from "elysia";
import { db } from "../db";

export const clientsRoutes = new Elysia({ prefix: "/clients" })
  .get("/", () => {
    return db.query("SELECT * FROM clients ORDER BY created_at DESC").all();
  })
  .get("/:id", ({ params: { id } }) => {
    const client = db.query("SELECT * FROM clients WHERE id = ?").get(id);
    if (!client) throw new Error("Client not found");
    return client;
  })
  .post(
    "/",
    ({ body, set }) => {
      // 1. Verificar si el DNI ya existe
      const exists = db
        .query("SELECT id FROM clients WHERE dni = ?")
        .get(body.dni);
      if (exists) {
        set.status = 409; // Conflict
        return { error: "El DNI ya está registrado" };
      }

      // 2. Insertar nuevo cliente
      const result = db
        .query(
          "INSERT INTO clients (dni, name, email, phone, address, notes, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *",
        )
        .get(
          body.dni,
          body.name,
          body.email || null,
          body.phone || null,
          body.address || null,
          body.notes || null,
          body.photoUrl || null,
        );
      return { success: true, data: result };
    },
    {
      body: t.Object({
        dni: t.String(),
        name: t.String(),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String()),
        notes: t.Optional(t.String()),
        photoUrl: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:id",
    ({ params: { id }, body }) => {
      // Check if client exists
      const existing = db.query("SELECT id FROM clients WHERE id = ?").get(id);
      if (!existing) throw new Error("Client not found");

      const result = db
        .query(
          "UPDATE clients SET dni = ?, name = ?, email = ?, phone = ?, address = ?, notes = ?, photo_url = ? WHERE id = ? RETURNING *",
        )
        .get(
          body.dni,
          body.name,
          body.email || null,
          body.phone || null,
          body.address || null,
          body.notes || null,
          body.photoUrl || null,
          id,
        );
      return { success: true, data: result };
    },
    {
      body: t.Object({
        dni: t.String(),
        name: t.String(),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String()),
        notes: t.Optional(t.String()),
        photoUrl: t.Optional(t.String()),
      }),
    },
  )
  .delete("/:id", ({ params: { id } }) => {
    db.run("DELETE FROM clients WHERE id = ?", [id]);
    return { success: true };
  });
