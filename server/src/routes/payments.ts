import { Elysia, t } from "elysia";
import { db } from "../db";

export const paymentsRoutes = new Elysia({ prefix: "/payments" })
  .get("/", () => {
    return db
      .query(
        `
      SELECT p.*, c.name as client_name, i.invoice_number
      FROM payments p 
      JOIN clients c ON p.client_id = c.id 
      LEFT JOIN invoices i ON i.payment_id = p.id
      ORDER BY p.payment_date DESC
    `,
      )
      .all();
  })
  .post(
    "/",
    ({ body, set }) => {
      // Validación del monto
      if (body.amount <= 0) {
        set.status = 400;
        return { error: "El monto debe ser mayor a cero" };
      }

      const createTransaction = db.transaction((data: any) => {
        // 1. Insertar el pago
        const payment = db
          .query(
            "INSERT INTO payments (client_id, membership_id, amount, method, reference) VALUES (?, ?, ?, ?, ?) RETURNING *",
          )
          .get(
            data.client_id,
            data.membership_id || null,
            data.amount,
            data.method,
            data.reference || null,
          ) as any;

        // 2. Generar factura básica automáticamente
        const invoiceNumber = `FAC-${payment.id.toString().padStart(5, "0")}`;
        db.query(
          "INSERT INTO invoices (payment_id, invoice_number, total) VALUES (?, ?, ?)",
        ).run(payment.id, invoiceNumber, payment.amount);

        return payment;
      });

      const result = createTransaction(body);
      return { success: true, data: result };
    },
    {
      body: t.Object({
        client_id: t.Number(),
        membership_id: t.Optional(t.Number()),
        amount: t.Number(),
        method: t.String(),
        reference: t.Optional(t.String()),
      }),
    },
  )