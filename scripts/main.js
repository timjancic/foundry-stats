const diceTypes = ["d100","d20","d12","d10","d8","d6","d4","d2"];
const dataNames = ["alias","flavor","advantageMode","nDice","faces","total","results"];

/*
the profile for each alias is organized in a table as follows. Each name is a column of data
[ ["attack roll result", "attack name"],["damage roll result", "damage name"], ["skill result","skill name"], ["d20 data","advantage data"] ];
for example:
18, sword - 8, sword - 17
*/
const pcArray = ["Brotir","Zanna"];
let pcData = new Array(pcArray.length);
let dmData = [[]];
let pcStats = new Array(pcArray.length);
let dmStats = [[]];
for (let i = 0; i < pcData.length; i++) {pcData[i] = []; pcStats[i] = [];} //fill array with empty arrays

class statsProfile {
  constructer () {
    this.attackData = {
      constructer () {
        this.results = [];
        this.name = [];
        this.alias = [];
      }
    };

    this.skillData = {
      constructer () {
        this.results = [];
        this.name = [];
        this.alias = [];
      }
    };
  }
};

/*
skillData: {
  constructer () {
    this.results = [];
    this.name = [];
    this.alias = [];
  }
},
d20Data: {
  constructer () {
    this.results = [];
    this.advantage = [];
  }
}
*/

function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    let rawArray = reader.result.split("\n");

    let dataTable = new Array(rawArray.length);

    //create a table of values from the info
    for (let i = 0; i < rawArray.length; i++) {
      dataTable[i] = JSON.parse(rawArray[i]);

      // dataTable[i] = rawArray[i].split(",");
      //turn blank numbers into 0 and number strings into integers
      /*
      for (let j = 2; j < dataTable[i].length; j++) {
        if (dataTable[i][j] == "") {
          dataTable[i][j] = 0;
          continue;
        }
        dataTable[i][j] = parseInt(dataTable[i][j]);
      }
      */
    }

    console.log(rawArray);
    console.log(dataTable);
    assignData(dataTable);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function assignData(dataTable) {
  for (let i = 0; i < dataTable.length; i++) {
    for (let j = 0; j < pcArray.length; j++) {
      //match rows with the same alias
      if (dataTable[i][0] == pcArray[j]) {
        pcData[j].push(dataTable[i]);
        break; //break the for loop since there is only be one alias per row of data.
      } else if (dataTable[i][0] != "" && j == pcArray.length - 1){
        dmData[0].push(dataTable[i]); //if alias exists but is not part of names array, assume it is DM controlled character
      }
    }
  }
}

function makeProfilePC(aliasData) {
  /*
  this function takes a single index of pcData and synthesizes the data into a profile
  profile = [ ["attack roll result", "attack name"],["damage roll result", "damage name"], ["skill result","skill name"], ["d20 data","advantage data"] ];
  aliasData = [0 "alias",1 "flavor",2 "advantageMode",3 "nDice",4 "faces",5 "total",6 "results"];
  */
  let attackData = [[],[]];
  let damageData = [[],[]];
  let skillData = [[],[]];
  let d20Data = [[],[]];

  for (let i = 0; i < aliasData.length; i++) {
    //Check the flavor for keywords and then assign data appropriately
    if (aliasData[i][1].includes("Attack")) {
      attackData[0].push(aliasData[i][5]) //temporary?
    }
  }
}
