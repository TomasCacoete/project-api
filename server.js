const express = require("express")
const app = express()

/* Port where the server will run.
Initially stated as an environment variable or, for testing purposes, as 3000*/
const port = process.env.PORT || 3000
//sets up json format middleware
app.use(express.json())

const entitiesRouter = require("./routes/entities")
app.use("/entities", entitiesRouter)

app.listen(port, () => console.log("Server Started"))