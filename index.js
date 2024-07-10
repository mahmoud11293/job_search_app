import express from "express";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
import { config } from "dotenv";
config();
import { connection_db } from "./DB/connection_db.js";
import { globalResponse } from "./src/Middlewares/error-handle.middleware.js";
import userRouter from "./src/Modules/user/user.route.js";
import companyRouter from "./src/Modules/company/company.route.js";
import jobRouter from "./src/Modules/jobs/jobs.route.js";

app.use("/users", userRouter);
app.use("/companies", companyRouter);
app.use("/jobs", jobRouter);

// global error handler
app.use(globalResponse);
// Connection Database
connection_db();

app.listen(port, () => console.log("Server is Running"));
