import "reflect-metadata";
import app from "./app";
import { connectMongo } from "./core/mongoose-client";
import { container } from "./core/container";
import { ConfigService, Logger } from "./core/services";

async function startServer() {
  const logger = container.resolve(Logger);
  const config = container.resolve(ConfigService);
  const port = Number(config.get("PORT", "3000"));

  try {
    const mongoUri = config.get("MONGO_URI");
    await connectMongo(mongoUri);
    app.listen(port, () => logger.info(`Server listening on port ${port}`));
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

startServer();
