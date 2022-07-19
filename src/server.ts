import app from "./index";
import logger from "./config/logger";

import connect from "./config/database";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
  logger.info(`Server running at: http://localhost:${PORT}`);

  await connect();
});