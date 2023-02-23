const express = require("express")
const router = express.Router()

//Get All entities
router.get("/", (req, res) => {
    res.status(200).json({
        message: "View every entity"
    })
})
//Get One entity by id
router.get("/:id", (req, res) => {
    res.status(200).json({
        ID: req.params.id
    })
})
module.exports = router