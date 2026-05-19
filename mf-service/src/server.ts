import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimiter }from "./middleware/rateLimiter";
import mfRoutes from "./routes/mfRoutes";
import { traceMiddleware } from "./middleware/traceMiddleware";

import { db } from "./config/db";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(rateLimiter);
app.use(traceMiddleware);

app.use(helmet());

app.use(morgan("dev"));

db.connect()
.then(()=>{
    console.log("DB Connected");
})
.catch((err)=>{
    console.log(err);
});

app.get("/health", (req,res)=>{
    res.json({
        status: "UP",
        service: "mf-service",
        timestamp: new Date().toISOString()
    });
});

app.use("/api", mfRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
});