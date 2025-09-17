import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

import { options } from "../config/swagger";

const specs = swaggerJsdoc(options);

const outputPath = path.join(__dirname, "../swagger.json");
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), "utf8");
console.log(`✅ Swagger spec exported to ${outputPath}`);
