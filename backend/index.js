import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow localhost for development
        if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            callback(null, true);
        }
        // Allow production domains (you'll need to update this with your frontend URL)
        else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            callback(null, true);
        }
        // For now, allow all origins in production (you should restrict this later)
        else if (process.env.NODE_ENV === "production") {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
