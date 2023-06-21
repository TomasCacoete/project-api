require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");

const port = process.env.API_PORT;

app.use(express.json());

app.use(cors({
    origin : "*",
}));

const entitiesRouter = require("./routes/entities");
app.use("/entities", entitiesRouter);

app.listen(port, () => console.log("Server Started on port " + port));