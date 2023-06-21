const date = require("./helping-functions.js");

async function getAllInfoMainPage(client) {
    const query = "select update_time,arcadian_id,type,reputation_value from repsys.entity_reputation";
    const result = await client.execute(query);
    if (result.error) {
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else {
        var info = [];
        for (var i=0; i < result.rows.length; i++) {
            var dic = {};
            dic["name"] = result.rows[i].arcadian_id;
            dic["type"] = result.rows[i].type;
            dic["reputation_score"] = (result.rows[i].reputation_value).toFixed(8);
            dic["date"] = parseInt(result.rows[i].update_time);

            var index = -1;
            for (var j=0; j < info.length; j++) {
                if (info[j]["name"] === result.rows[i].arcadian_id) {
                    index = j;
                    break;
                }
            }
            if (index !== -1 && result.rows[i].update_time > info[index]["date"]) {
                info[index] = dic;
            } else if (index === -1) {
                info.push(dic);
            }
        }
        for (var i=0; i < info.length; i++) {
            delete info[i]["date"];
        }
        return info;
    }
}

async function getIdentityInfo(client, id) {
    const query = "select arcadian_id,type,reputation_value,event_type,update_time,action_type from repsys.entity_reputation where arcadian_id=? ALLOW FILTERING";
    const parameters = [id];
    const result = await client.execute(query, parameters);
    if (result.error) {
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else {
        var info = [];
        for (var i=0; i < result.rows.length; i++) {
            var dic = {};
            if(result.rows[i].event_type == true) 
                dic["rating"] = "positive";
            else 
                dic["rating"] = "negative";
            dic["date"] = date.eventMonthYear(result.rows[i].update_time);
            dic["action_type"] = result.rows[i].action_type;
            info.push(dic);
        }
        return info;
    }
}

async function getEntityAddInfo(client, id) {
    const query = "select action_type,event_type,reputation_model,update_time,exchange_name from repsys.entity_reputation where arcadian_id=? ALLOW FILTERING";
    const parameters = [id];
    const result = await client.execute(query, parameters);
    if (result.error) {
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else {
        var addInfo = [];
        for (var i = 0; i < result.rows.length; i++) {
            var dic = {};
            dic["action_type"] = result.rows[i].action_type;
            dic["reputation_model"] = result.rows[i].reputation_model;
            if (result.rows[i].event_type == true)
                dic["rating"] = "positive";
            else
                dic["rating"] = "negative";
            dic["date"] = date.formatFullDate(result.rows[i].update_time);
            dic["exchange_name"] = result.rows[i].exchange_name;
            addInfo.push(dic);
        }
        return addInfo;
    }
}

async function getEntityTimeReputation(client, id) {
    const query = "select update_time,reputation_value from repsys.entity_reputation where arcadian_id=? ALLOW FILTERING";
    const parameters = [id];
    const result = await client.execute(query, parameters);
    if (result.error) {
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else {
        var timeRepInfo = [];
        for (var i = 0; i < result.rows.length; i++) {
            dic = {};
            time = new Date(parseInt(result.rows[i].update_time));
            dic["date"] = time
            dic["reputation_value"] = result.rows[i].reputation_value;
            timeRepInfo.push(dic);
        }
        timeRepInfo.sort((a, b) => a.date - b.date);
        for (var i = 0; i < timeRepInfo.length; i++) {
            timeRepInfo[i]["date"] = date.formatDate(timeRepInfo[i]["date"]);
        }
        return timeRepInfo;
    }
}

async function getAllInfoStatisticsPage(client) {
    const query = "select update_time,arcadian_id,type,reputation_value from repsys.entity_reputation";
    const result = await client.execute(query);
    if (result.error) {
        console.error("Error retrieving data: ", result.error);
        throw result.error;
    } else {
        var info = [];
        var unique_types = [];
        var unique_entitys = [];
        var all_entities = [];
        for (var i=0; i < result.rows.length; i++) {
            var dic = {};
            dic["name"] = result.rows[i].arcadian_id;
            dic["type"] = result.rows[i].type;
            dic["reputation_score"] = result.rows[i].reputation_value;
            dic["date"] = parseInt(result.rows[i].update_time);

            var index = -1;
            for (var j=0; j < all_entities.length; j++) {
                if (all_entities[j]["name"] === result.rows[i].arcadian_id) {
                    index = j;
                    break;
                }
            }
            if (index !== -1 && result.rows[i].update_time > all_entities[index]["date"]) {
                all_entities[index] = dic;
            } else if (index === -1) {
                all_entities.push(dic);
            }

            if (!unique_entitys.includes(result.rows[i].arcadian_id))
                unique_entitys.push(result.rows[i].arcadian_id);
            if (!unique_types.includes(result.rows[i].type))
                unique_types.push(result.rows[i].type);
        }
        for (var i=0; i < all_entities.length; i++) {
            delete all_entities[i]["date"];
        }
        
        for (var i = 0; i < unique_types.length; i++) {
            var dic = {};
            dic["type"] = unique_types[i];
            dic["number"] = 0;
            dic["mean"] = 0;
            dic["min"] = 1;
            dic["max"] = 0;
            for (var j = 0; j < all_entities.length; j++) {
                if (all_entities[j]["type"] === unique_types[i]) {
                    dic["number"]++;
                    dic["mean"] += all_entities[j]["reputation_score"];
                    if (dic["min"] > all_entities[j]["reputation_score"])
                        dic["min"] = all_entities[j]["reputation_score"].toFixed(8)
                    if (dic["max"] < all_entities[j]["reputation_score"])
                        dic["max"] = all_entities[j]["reputation_score"].toFixed(8)
                }
            }
            info.push(dic);
        }

        for (var i = 0; i < info.length; i++) {
            info[i]["mean"] /= info[i]["number"];
            info[i]["mean"] = info[i]["mean"].toFixed(8);
        }
        var n = {"entities": unique_entitys.length, "events": result.rows.length};
        info = [n, ...info];
        return info;
    }
}

module.exports = {getAllInfoMainPage, getIdentityInfo, getEntityAddInfo, getEntityTimeReputation, getAllInfoStatisticsPage};