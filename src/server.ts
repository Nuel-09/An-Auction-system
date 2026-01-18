import path, { dirname } from "node:path";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fastifyCors from "@fastify/cors";
import MongoStore from "connect-mongo";
import ejs from "ejs";
import dotenv from "dotenv";

import { connectDB } from "./config/database";
import { setAuthHooks } from "./middleware/auth";
import adminAuthRoutes from "./routes/adminAuthRoutes";
import sellerLeadRoutes from "./routes/sellerLeadRoutes";
import itemsRoutes from "./routes/itemsRoutes";
import auctionRoutes from "./routes/auctionRoutes";
import publicRoutes from "./routes/publicRoutes";
import { registerPublicSellerRoutes } from "./routes/publicSellerRoutes";

dotenv.config();

const app = Fastify({
  logger: true,
});
const PORT = parseInt(process.env.FASTIFY_PORT || "3000", 10);
const HOST = process.env.FASTIFY_HOST || "0.0.0.0";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "your-session-secret-change-in-production";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/fotherbys";

const configurePlugins = async () => {
  await app.register(fastifyCors, { origin: true, credentials: true });
  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    secret: SESSION_SECRET,
    cookieName: "fotherbys.sid",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      ttl: 60 * 60 * 24 * 7,
    }),
  });

  setAuthHooks(app);

  await app.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
    prefix: "/public/",
  });

  await app.register(fastifyView, {
    root: path.join(__dirname, "views"),
    engine: { ejs },
  });
};

const registerRoutes = async () => {
  await app.register(publicRoutes, { prefix: "/" });
  await app.register(registerPublicSellerRoutes, { prefix: "/" });
  await app.register(adminAuthRoutes, { prefix: "/" });
  await app.register(sellerLeadRoutes);
  await app.register(itemsRoutes);
  await app.register(auctionRoutes);
};

const start = async () => {
  try {
    // connect to Mongodb
    await connectDB();

    // Configure plugins
    await configurePlugins();

    // Register routes
    await registerRoutes();

    //start server
    await app.listen({ port: PORT, host: HOST });
  } catch (error) {
    console.error("server failed to start:", error);
    process.exit(1);
  }
};

start();
