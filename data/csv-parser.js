//MODULES
const fs = require("fs");
//FUNCTIONS
//................
//function to get every identity in a database aswell as it's individual attributes in a dictionary
function getEveryIdentityFromCSV(...wanted_attributes){
    var data = fs.readFileSync("data/data.csv", "utf8");

    var lines = data.split("\n");
    for(var i = 0; i < lines.length; i++){
        lines[i] = lines[i].split(",");
    }

    var entities = [];
    for(var i = 1; i<lines.length; i++){
        aux = {};
        for(var j = 0; j<lines[0].length; j++){
            if(wanted_attributes.includes(lines[0][j])){
                aux[lines[0][j]] = lines[i][j];
            }
        }
        entities.push(aux);
    }

    return entities;
}

function getOneIdentityFromCSV(id){
    var data = fs.readFileSync("data/data.csv", "utf8");
    var lines = data.split("\n");

    //var entity_atributes = lines[0].split(",");
    //lines.shift();
    var entity = []
    for(var i = 0; i < lines.length; i++){
        lines[i] = lines[i].split(",");
        var aux = {};
        if(lines[i][0] == id){
            for(var j = 0; j < lines[0].length; j++){
                aux[lines[0][j]] = lines[i][j];
            }
            entity.push(aux);
        }
    }
    return entity;
}

module.exports = {getEveryIdentityFromCSV,getOneIdentityFromCSV};