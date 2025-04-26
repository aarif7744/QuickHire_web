import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from 'path'

dotenv.config();

const app = express();
const _dirname = path.resolve()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ Parse cookies

// ✅ Allow cookies & credentials in CORS
const corsOptions = {
    origin: "https://quickhire-web-5.onrender.com",
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// ✅ Test Route
app.get("/api/v1/test", (req, res) => {
    res.send("Test route working!");
});

// ✅ API Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/companies", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})
// ✅ Start Server
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server running at port ${PORT}`);
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
});
