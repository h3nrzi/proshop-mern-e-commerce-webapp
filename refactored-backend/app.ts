import express from "express";
import exampleRoutes from "./routes/example.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./core/middleware/error-handler";

const app = express();

app.use(express.json());
app.use("/api/examples", exampleRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

export default app;
