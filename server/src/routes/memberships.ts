import { Elysia, t } from "elysia";
import { db } from "../db";

export const membershipsRoutes = new Elysia({ prefix: "/memberships" })
  .get("/", () => {
    return db
      .query(
        `
        SELECT m.*, c.name as client_name, p.name as plan_name 
        FROM memberships m
        JOIN clients c ON m.client_id = c.id
        JOIN plans p ON m.plan_id = p.id
        ORDER BY m.end_date DESC
      `,
      )
      .all();
  })
  .post(
    "/",
    ({ body }) => {
      // Calculate end date based on plan duration if not provided? No, client should provide it or server logic here.
      // Let's assume start_date is provided. We need plan duration to calculate end_date ideally, or receive both.
      // Better: receive plan_id and start_date. Calculate end_date from plan.

      const plan = db
        .query("SELECT * FROM plans WHERE id = ?")
        .get(body.plan_id) as any;
      if (!plan) throw new Error("Plan not found");

      const startDate = new Date(body.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.duration_days);

      const result = db
        .query(
          "INSERT INTO memberships (client_id, plan_id, start_date, end_date, price_paid, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING *",
        )
        .get(
          body.client_id,
          body.plan_id,
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0],
          plan.price,
          "active",
        );

      return { success: true, data: result };
    },
    {
      body: t.Object({
        client_id: t.Number(),
        plan_id: t.Number(),
        start_date: t.String(), // YYYY-MM-DD
      }),
    },
  );
