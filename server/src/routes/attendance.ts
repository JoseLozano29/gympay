import { Elysia, t } from "elysia";
import { db } from "../db";

export const attendanceRoutes = new Elysia({ prefix: "/attendance" })
  .get("/", () => {
    return db
      .query(
        `
      SELECT a.*, c.name as client_name, c.dni as client_dni
      FROM attendance a
      JOIN clients c ON a.client_id = c.id
      ORDER BY a.check_in DESC
    `,
      )
      .all();
  })
  .post(
    "/",
    ({ body, set }) => {
      // Validación: DNI vacío
      if (!body.dni || !body.dni.trim()) {
        set.status = 400;
        return { error: "El DNI es obligatorio" };
      }

      // Find client by DNI
      const client = db
        .query("SELECT id FROM clients WHERE dni = ?")
        .get(body.dni) as { id: number } | undefined;

      if (!client) {
        set.status = 404;
        return { error: "Cliente no encontrado" };
      }

      const result = db
        .query("INSERT INTO attendance (client_id) VALUES (?) RETURNING *")
        .get(client.id);

      return { success: true, data: result };
    },
    {
      body: t.Object({
        dni: t.String(),
      }),
    },
  );
