/*const cassandra = require("cassandra-driver");
const authProvider = new cassandra.auth.PlainTextAuthProvider("cassandra","cassandra");

const client = new cassandra.Client({
    contactPoints: ["aiot-rs-prod.dei.uc.pt"],
    protocolOptions: { port: 9009 },
    localDataCenter: "datacenter1",
    authProvider,
    keyspace: "repsys"
});*/

const date = require("./helping-functions.js");

async function getAllInfoMainPage(client){
    const query = "select update_time,arcadian_id,type,reputation_value from repsys.entity_reputation";
    const result = await client.execute(query);
    if(result.error){
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else{
        var info = [];
        for(var i=0; i<result.rows.length; i++){
            var dic = {};
            dic["name"] = result.rows[i].arcadian_id;
            dic["type"] = result.rows[i].type;
            dic["reputation_score"] = result.rows[i].reputation_value;
            dic["date"] = parseInt(result.rows[i].update_time);

            var index = -1;
            for(var j=0; j<info.length; j++) {
                if(info[j]["name"] === result.rows[i].arcadian_id){
                    index = j;
                    break;
                }
            }
            if(index !== -1 && result.rows[i].update_time > info[index]["date"]){
                info[index] = dic;
            } else if(index === -1){
                info.push(dic);
            }
        }
        for(var i=0; i<info.length; i++){
            delete info[i]["date"];
        }
        return info;
    }
}

async function getIdentityInfo(client, id){
    const query = "select arcadian_id,type,reputation_value,sent,update_time,action_type from repsys.entity_reputation where arcadian_id=? ALLOW FILTERING";
    const parameters = [id];
    const result = await client.execute(query, parameters);
    if(result.error){
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else{
        var info = [];
        for(var i=0; i<result.rows.length; i++){
            var dic = {};
            //dic["name"] = result.rows[i].arcadian_id;
            //dic["type"] = result.rows[i].type;
            //dic["reputation_score"] = result.rows[i].reputation_value;
            if(result.rows[i].sent == true) dic["rating"] = "positive";
            else dic["rating"] = "negative";
            dic["date"] = date.eventMonthYear(result.rows[i].update_time);
            dic["action_type"] = result.rows[i].action_type;
            info.push(dic);
        }
        return info;
    }
}

/*async function printTable(client){
    const query = "select * from repsys.entity_reputation";
    const result = await client.execute(query);
    if(result.error){
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else{
        console.table(result.rows);
    }
}

printTable(client);*/

module.exports = {getAllInfoMainPage, getIdentityInfo};

/*async function main() {
    const info = await getAllInfoMainPage(client);
    console.log(info);
}*/