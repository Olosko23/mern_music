import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
dotenv.config();
const PORT = process.env.PORT || 7000;
const URI = process.env.MONGO_URI;

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        `Mongo DB Connected Successfully & Server running on Port ${PORT}`
      )
    );
  })
  .catch((error) => console.log({ message: error.message }));

app.get("/api/v1", (req, res) => {
  res.status(200).json("Server status is good");
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/artist", artistRoutes);
