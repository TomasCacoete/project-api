const express = require("express")
const router = express.Router()

//Get All entities
router.get("/", (req, res) => {
    res.send("Hello World")
})
//Get One entity by id
router.get("/:id", (req, res) => {
    res.send(req.params.id)
})
module.exports = router