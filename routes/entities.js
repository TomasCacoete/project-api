const express = require("express")
const router = express.Router()

const csv = require("../data/csv-parser.js");
//Get All entities
router.get("/", (req, res) => {
    var a = csv.getEveryIdentityFromCSV("Type","Score","Rating","Date","Action_Type");
    res.status(200).send(JSON.stringify(a, null, 2));
})
//Get One entity by id
router.get("/:id", (req, res) => {
    res.status(200).json({
        ID: req.params.id
    })
})
module.exports = router