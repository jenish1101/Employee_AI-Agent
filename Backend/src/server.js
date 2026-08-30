import app from "./app.js";

import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(env.port, () => {
            console.log(
                `Server running on http://localhost:${env.port}`
            );
        });
    } catch (error) {
        console.error("Server startup failed:", error);

        process.exit(1);
    }
};

startServer();