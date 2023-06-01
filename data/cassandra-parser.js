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
    const query = "select event_type,update_time,action_type from repsys.entity_reputation where arcadian_id=? ALLOW FILTERING";
    const parameters = [id];
    const result = await client.execute(query, parameters);
    if(result.error){
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else{
        var info = [];
        for(var i=0; i<result.rows.length; i++){
            var dic = {};
            if(result.rows[i].event_type == true) dic["rating"] = "positive";
            else dic["rating"] = "negative";
            dic["date"] = date.eventMonthYear(result.rows[i].update_time);
            dic["action_type"] = result.rows[i].action_type;
            info.push(dic);
        }
        return info;
    }
}

async function getAllInfoStatisticsPage(client){
    const query = "select * from repsys.entity_reputation";
    const result = await client.execute(query);
    if(result.error){
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else{
        var info = [];
        var unique_types = [];
        var unique_entitys = [];
        for(var i=0; i<result.rows.length; i++){
            if(!unique_entitys.includes(result.rows[i].arcadian_id))
                unique_entitys.push(result.rows[i].arcadian_id);

            if(!unique_types.includes(result.rows[i].type)){
                var dic = {}
                dic["type"] = result.rows[i].type;
                dic["number"] = 1;
                dic["mean"] = result.rows[i].reputation_value;
                dic["min"] = result.rows[i].reputation_value;
                dic["max"] = result.rows[i].reputation_value;
                info.push(dic);
                unique_types.push(result.rows[i].type);
            } else{
                for(var j=0; j<info.length; j++){
                    if(info[j]["type"] === result.rows[i].type){
                        info[j]["number"]++;
                        info[j]["mean"] += result.rows[i].reputation_value;
                        if(info[j]["min"] > result.rows[i].reputation_value)
                            info[j]["min"] = result.rows[i].reputation_value
                        if(info[j]["max"] < result.rows[i].reputation_value)
                            info[j]["max"] = result.rows[i].reputation_value
                        break;
                    }
                }
            }
        }
        for(var i=0; i<info.length; i++){
            info[i]["mean"] /= info[i]["number"];
        }
        var n = {"entities": unique_entitys.length, "events": result.rows.length};
        info = [n, ...info];
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

module.exports = {getAllInfoMainPage, getIdentityInfo, getAllInfoStatisticsPage};

/*async function main() {
    const info = await getAllInfoMainPage(client);
    console.log(info);
}*/