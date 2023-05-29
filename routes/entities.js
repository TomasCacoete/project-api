const express = require("express");
const cassandra = require("cassandra-driver");

const router = express.Router();
const authProvider = new cassandra.auth.PlainTextAuthProvider("cassandra","cassandra");

const client = new cassandra.Client({
    contactPoints: ["aiot-rs-prod.dei.uc.pt"],
    protocolOptions: { port: 9009 },
    localDataCenter: "datacenter1",
    authProvider,
    keyspace: "repsys"
});

const cassandra_parser = require("../data/cassandra-parser.js");

router.get("/", async (req, res) => {
    var every_identity_info = await cassandra_parser.getAllInfoMainPage(client);
    res.status(200).send(JSON.stringify(every_identity_info, null, 2));
})
router.get("/:id", async (req, res) => {
    var identity_info = await cassandra_parser.getIdentityInfo(client, req.params.id);
    res.status(200).send(JSON.stringify(identity_info, null, 2))
})

module.exports = router