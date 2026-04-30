import { Elysia } from "elysia";
import { db } from "../db";
import bcrypt from "bcryptjs";
import { jwtPlugin } from "../plugins/jwt";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(jwtPlugin)
  .post("/register", async ({ body, set }) => {
    const { name, email, password } = body as any;

    if (!name || !email || !password) {
      set.status = 400;
      return { error: "Todos los campos son obligatorios" };
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = db.prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      );
      const result = query.run(name, email, hashedPassword, "user");

      set.status = 201;
      return {
        message: "Usuario registrado correctamente",
        userId: result.lastInsertRowid,
      };
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        set.status = 409;
        return { error: "El correo ya está registrado" };
      }
      set.status = 500;
      return { error: "Error al registrar usuario" };
    }
  })
  .post("/login", async ({ body, set, jwt }) => {
    const { email, password } = body as any;

    if (!email || !password) {
      set.status = 400;
      return { error: "Correo y contraseña son obligatorios" };
    }

    try {
      const user = db
        .query("SELECT * FROM users WHERE email = ?")
        .get(email) as any;

      if (!user) {
        set.status = 401;
        return { error: "Correo o contraseña incorrectos" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        set.status = 401;
        return { error: "Correo o contraseña incorrectos" };
      }

      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      set.status = 500;
      return { error: "Error interno del servidor" };
    }
  })
  .post("/logout", async ({ headers, set }) => {
    const auth = headers["authorization"];
    if (!auth) {
      return { message: "Sesión cerrada (no había token)" };
    }

    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

    try {
      db.run("INSERT OR IGNORE INTO revoked_tokens (token) VALUES (?)", [token]);
      return { message: "Sesión cerrada correctamente" };
    } catch (error) {
      set.status = 500;
      return { error: "Error al invalidar token" };
    }
  });


