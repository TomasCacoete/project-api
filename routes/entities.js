require("dotenv").config();
const express = require("express");
const cassandra = require("cassandra-driver");

const router = express.Router();
const authProvider = new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME,process.env.CASSANDRA_PASSWORD);

const client = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_HOST],
    protocolOptions: { port: process.env.CASSANDRA_PORT },
    localDataCenter: process.env.CASSANDRA_DATACENTER,
    authProvider,
    keyspace: process.env.CASSANDRA_KEYSPACE
});

const cassandra_parser = require("../data/cassandra-parser.js");

router.get("/", async (req, res) => {
    var every_identity_info = await cassandra_parser.getAllInfoMainPage(client);
    res.status(200).send(JSON.stringify(every_identity_info, null, 2));
})
router.get("/statistics", async (req, res) => {
    var statistics_info = await cassandra_parser.getAllInfoStatisticsPage(client);
    res.status(200).send(JSON.stringify(statistics_info, null, 2));
})
router.get("/:id", async (req, res) => {
    var identity_info = await cassandra_parser.getIdentityInfo(client, req.params.id);
    res.status(200).send(JSON.stringify(identity_info, null, 2));
})

module.exports = router