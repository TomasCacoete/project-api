const cassandra = require("cassandra-driver");
const authProvider = new cassandra.auth.PlainTextAuthProvider("cassandra","cassandra");

const client = new cassandra.Client({
    contactPoints: ["http://aiot-rs-prod.dei.uc.pt"],
    protocolOptions: { port: 9009 },
    localDataCenter: "datacenter1",
    authProvider,
    keyspace: "repsys"
});

const query = "select * from repsys.entity_reputation";

client.execute(query, (err, result) => {
    if(err) console.error("Error retrieving data: ", err);
    else console.table(result.rows);
    client.shutdown();
})