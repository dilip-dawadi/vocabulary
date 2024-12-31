import express from "express";
import vocabularyRoute from "./routes/vocabulary.js"; // Import vocabulary route
import cors from "cors";
import bodyParser from "body-parser";
import path from "path"; // Import path module
import url from "url"; // Import URL module
const app = express();
// Get the directory name using import.meta.url
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow necessary methods
    allowedHeaders: ["Content-Type"], // Allow necessary headers
}));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// Log the path being used for the dist folder
const distPath = path.join(__dirname, "../../dist");
// Serve static files from ../../dist folder
app.use(express.static(distPath));
// Mount the vocabulary router at '/vocabulary' path
app.use("/vocabulary", vocabularyRoute);
// Catch-all route to serve index.html for any other route
app.get("*", (req, res) => {
    res.sendFile(distPath);
});
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
