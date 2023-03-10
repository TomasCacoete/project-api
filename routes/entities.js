const express = require("express");
const router = express.Router();

const csv = require("../data/csv-parser.js");
//Get All entities
router.get("/", (req, res) => {
    var every_identity_info = csv.getEveryIdentityFromCSV(/*"Type","Score",*/"Rating","Date","Action_Type");
    res.status(200).send(JSON.stringify(every_identity_info, null, 2));
})
//Get One entity by id
router.get("/:id", (req, res) => {
    var identity_info = csv.getOneIdentityFromCSV(req.params.id);
    res.status(200).send(JSON.stringify(identity_info, null, 2))
})
module.exports = router