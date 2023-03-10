//MODULES
const fs = require("fs");
//FUNCTIONS
//................
//helping function that produces the same effect as the python zip() function
const zip = (a, b) => a.map((k, i) => [k, b[i]]);
//function to get every identity in a database aswell as it's individual attributes in a dictionary
function getEveryIdentityFromCSV(...wanted_attributes){
    var data = fs.readFileSync("data/data.csv", "utf8");
    var lines = data.split("\n");
    //Creation of List with the Identities attributes
    var entity_atributes = lines[0].split(",");
    //Creation of List with the Data of All Identities
    lines.shift();
    for(var i = 0; i < lines.length; i++){
        lines[i] = lines[i].split(",");
    }
    //Dictionary that correlates every entity with it's attributes values in a JSON looking format
    var entities = {};
    var aux;
    for(var i = 0; i<lines.length; i++){
        entities[lines[i][0]] = {};
        aux = zip(entity_atributes,lines[i]);
        for(var a = 1; a<aux.length; a++){
            if (wanted_attributes.includes(aux[a][0]) == true){
                entities[lines[i][0]][aux[a][0]] = aux[a][1];
            }
        }
    }
    fs.writeFileSync('data/latest-request.json', JSON.stringify(entities, null, 2));
    return entities;
}

function getOneIdentityFromCSV(id){
    var data = fs.readFileSync("data/data.csv", "utf8");
    var lines = data.split("\n");

    var entity_atributes = lines[0].split(",");
    lines.shift();
    var info;
    for(var i = 0; i < lines.length; i++){
        lines[i] = lines[i].split(",");
        if(lines[i][0] == id){
            info = lines[i];
            break;
        }
    }
    entity = {};
    for(var i = 1; i < info.length;i++){
        entity[entity_atributes[i]] = info[i];
    }
    fs.writeFileSync('data/latest-request.json', JSON.stringify(entity, null, 2));
    return entity;
}

module.exports = {getEveryIdentityFromCSV,getOneIdentityFromCSV};