import { Elysia, t } from "elysia";
import { db } from "../db";

export const invoicesRoutes = new Elysia({ prefix: "/invoices" })
  .get("/", () => {
    return db
      .query(
        `
      SELECT i.*, p.amount, c.name as client_name
      FROM invoices i
      JOIN payments p ON i.payment_id = p.id
      JOIN clients c ON p.client_id = c.id
      ORDER BY i.issue_date DESC
    `,
      )
      .all();
  })
  .get("/:id", ({ params }) => {
    return db
      .query(
        `
      SELECT 
        i.*, 
        p.amount, p.method, p.payment_date, p.reference,
        c.name as client_name, c.dni as client_dni, c.email as client_email, c.phone as client_phone
      FROM invoices i
      JOIN payments p ON i.payment_id = p.id
      JOIN clients c ON p.client_id = c.id
      WHERE i.id = ?
    `,
      )
      .get(params.id);
  })
  .post(
    "/",
    ({ body }) => {
      const result = db
        .query(
          "INSERT INTO invoices (payment_id, invoice_number, total) VALUES (?, ?, ?) RETURNING *",
        )
        .get(body.payment_id, body.invoice_number, body.total);
      return { success: true, data: result };
    },
    {
      body: t.Object({
        payment_id: t.Number(),
        invoice_number: t.String(),
        total: t.Number(),
      }),
    },
  );
