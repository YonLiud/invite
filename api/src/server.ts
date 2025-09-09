import "reflect-metadata";
import express from 'express';
import { AppDataSource } from './data-source';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");

    app.get('/', (req, res) => {
      res.send('Hello from your learning backend! 🚀');
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
});
