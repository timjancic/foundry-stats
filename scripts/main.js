const diceTypes = ["d100","d20","d12","d10","d8","d6","d4","d2"];
const dataNames = ["alias","flavor","advantageMode","nDice","faces","total","results"];
const abilities = ["Strength","Dexterity","Constitution","Intelligence","Wisdom","Charisma"];
const skills = ["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"];


class StatsProfile {
  constructor () {
    this.attackData = {
      total: [],
      name: [],
      alias: []
    };

    this.damageData = {
      results: [],
      total: [],
      name: [],
      alias: []
    };

    //skillData includes ability checks, skill checks, and saving throws
    this.skillData = {
      total: [],
      name: [],
      alias: []
    };

    this.d20Data = {
      results: [], //values of d20 rolls before modifiers
      advantage: [] //list of advantageModes, 1 = advantage, -1 = disadvantage
    };

    this.meta = {
      nd20Array: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //each index stands for number of times a value was rolled, used for histogram
      nAbilityArray: [0,0,0,0,0,0], //number of times each ability was used, in order of abilities constant
      nSaveArray: [0,0,0,0,0,0], //number of times each saving throw was used, in order of abilities constant
      nSkillArray: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //number of times each skill was used, in alphabetical order as in skills constant
      avgd20: 0, //average d20 roll before modifiers
      avgAttack: 0, //average attack roll total (including modifiers)
      avgAttackArray: [], //average roll per attack type, should be in format [[average,times used, name],[average,times used, name]...]
      avgAbility: 0, //average ability, skill or saving throw roll total (including modifiers)
      avgAbilityArray: [], //average roll per skill,ability,save type, should be in format [[average,times used, name],[average,times used, name]...]
      favAttack: "", //most used attack based off of how many times damage is rolled or how many times an attack was rolled, whichever is higher
      favAbility: "", //most used ability or skill for checks
      damageSum: 0, //sum of damage dealt
      damageArray: [], //list of each weapon and how much total damage was done with each in format [[sum, times used, name]...]
      damageMax: [0,""], //max damage dealt in one roll, format [Max damage, name of attack used]
      nAdv: 0, //number of times with advantage
      nDis: 0 //number of times with disadvantage
    }
  }

  analyzeData() {
    let count = 0;
    let sum = 0.0;
    let namesUnique;
    let nNamesUsed; //for keeping track of how many times a unique name is used.
    let namesSum;


    //first analyze d20 data
    for (let i = 0; i < this.d20Data.results.length; i++) {
      if (this.d20Data.advantage[i] == 1) {
        this.meta.nAdv++;
      } else if (this.d20Data.advantage[i] == -1) {
        this.meta.nDis++;
      }

      for (let j = 0; j < this.d20Data.results[i].length; j++) {
        this.meta.nd20Array[this.d20Data.results[i][j] - 1]++; //add one in location of value
        count++;
        sum = sum + this.d20Data.results[i][j];
      }
    }
    this.meta.avgd20 = sum/count;

    //reset count and sum
    count = 0;
    sum = 0.0;

    //ANALYZE
    //ATTACK
    //DATA
    namesUnique = Array.from(new Set(this.attackData.name)); //unique list of names used
    nNamesUsed = new Array(namesUnique.length); //number of times each unique name is rolled
    nNamesUsed.fill(0);
    namesSum = new Array(namesUnique.length); //sum of results of each unique attack so that the average can be found.
    namesSum.fill(0);

    for (let i = 0; i < this.attackData.name.length; i++) {
      nNamesUsed[namesUnique.indexOf(this.attackData.name[i])]++; //increase the associated nNamesUsed of namesUnique by one each time it appears.
      namesSum[namesUnique.indexOf(this.attackData.name[i])] += this.attackData.total[i]; //temporarily sum associated rolls
      count++;
      sum = sum + this.attackData.total[i];
    }
    this.meta.avgAttack = sum/count;

    let maxTimesUsed = 0;
    for (let i = 0; i < namesUnique.length; i++) {
      this.meta.avgAttackArray.push([namesSum[i]/nNamesUsed[i],nNamesUsed[i],namesUnique[i]]); // create table where a row is [average,times used, name]

      //Check if the number of times this damage was used is more than the current max
      if (maxTimesUsed < nNamesUsed[i]) {
        this.meta.favAttack = namesUnique[i];
        maxTimesUsed = nNamesUsed[i];
      }
    }

    //reset count and sum
    count = 0;
    sum = 0.0;

    //ANALYZE
    //DAMAGE
    //DATA

    //reset arrays
    namesUnique = Array.from(new Set(this.damageData.name)); //unique list of names used
    nNamesUsed = new Array(namesUnique.length); //number of times each unique name is rolled
    nNamesUsed.fill(0);
    namesSum = new Array(namesUnique.length); //sum of results of each unique damage so that total damage of each weapon can be found.
    namesSum.fill(0);

    let maximumDamage = 0;
    let maximumDamageName = "";
    for (let i = 0; i < this.damageData.name.length; i++) {
      nNamesUsed[namesUnique.indexOf(this.damageData.name[i])]++; //increase the associated nNamesUsed of namesUnique by one each time it appears.
      namesSum[namesUnique.indexOf(this.damageData.name[i])] += this.damageData.total[i]; //sum associated rolls

      sum = sum + this.damageData.total[i];
      if (this.damageData.total[i] > maximumDamage) {
        maximumDamage = this.damageData.total[i];
        maximumDamageName = this.damageData.name[i];
      }
    }
    this.meta.damageSum = sum;
    this.meta.damageMax = [maximumDamage,maximumDamageName];

    for (let i = 0; i < namesUnique.length; i++) {
      this.meta.damageArray.push([namesSum[i],nNamesUsed[i],namesUnique[i]]); //create table where a row is [damage sum, times used, name]

      //Check if the number of times this damage was used is more than the current max
      if (maxTimesUsed < nNamesUsed[i]) {
        this.meta.favAttack = namesUnique[i];
        maxTimesUsed = nNamesUsed[i];
      }
    }

    //ANALYZE
    //ABILITY,
    //SKILL,
    //AND SAVING THROW
    //DATA

    //reset arrays
    namesUnique = Array.from(new Set(this.skillData.name)); //unique list of names used
    nNamesUsed = new Array(namesUnique.length); //number of times each unique name is rolled
    nNamesUsed.fill(0);
    namesSum = new Array(namesUnique.length); //sum of results of each unique damage so that total damage of each weapon can be found.
    namesSum.fill(0);

    //reset count and sum
    count = 0;
    sum = 0.0;

    //reset maxTimesUsed now that it is no longer needed for attack and damage
    maxTimesUsed = 0;

    for (let i = 0; i < this.skillData.name.length; i++) {
      nNamesUsed[namesUnique.indexOf(this.skillData.name[i])]++; //increase the associated nNamesUsed of namesUnique by one each time it appears.
      namesSum[namesUnique.indexOf(this.skillData.name[i])] += this.skillData.total[i]; //temporarily sum associated rolls
      count++;
      sum = sum + this.skillData.total[i];

      //find out which skill, ability, or saving throw this is and increase the appropriate array index
      if (this.skillData.name[i].includes("Saving")) {
        //cycle through names of abilities to see if the name of the skill has the ability that matches it
        for (let j = 0; j < abilities.length; j++) {
          if (this.skillData.name[i].includes(abilities[j])) {
            this.meta.nSaveArray[j]++;
            break;
          }
        }
      } else if (this.skillData.name[i].includes("Ability")) {
        //cycle through names of abilities to see if the name of the skill has the ability that matches it
        for (let j = 0; j < abilities.length; j++) {
          if (this.skillData.name[i].includes(abilities[j])) {
            this.meta.nAbilityArray[j]++;
            break;
          }
        }
      } else if (this.skillData.name[i].includes("Skill")) {
        //cycle through names of skills to see if the name of the skill has the ability that matches it
        for (let j = 0; j < skills.length; j++) {
          if (this.skillData.name[i].includes(skills[j])) {
            this.meta.nSkillArray[j]++;
            break;
          }
        }
      }
    }
    this.meta.avgAbility = sum/count;

    for (let i = 0; i < namesUnique.length; i++) {
      this.meta.avgAbilityArray.push([namesSum[i]/nNamesUsed[i],nNamesUsed[i],namesUnique[i]]); // create table where a row is [average,times used, name]

      //Check if the number of times this damage was used is more than the current max
      if (maxTimesUsed < nNamesUsed[i]) {
        this.meta.favAbility = namesUnique[i];
        maxTimesUsed = nNamesUsed[i];
      }
    }
  }

}

//const pcArray = ["Brotir","Zanna"]; //temporary test names, will gather from user in future.
const pcArray = ["Akira","Almorah","Leeania","Sevante","Sir Studly"];
let pcData = new Array(pcArray.length);
let dmData = [[]];
let pcStats = new Array(pcArray.length);
let dmStats = new StatsProfile();
for (let i = 0; i < pcData.length; i++) {pcData[i] = []; pcStats[i] = new StatsProfile();} //fill array with empty arrays

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
    }

    let assignment = new Promise((resolve,reject) => {
      if (assignData(dataTable)) {
        resolve();
        console.log("assignment finished");
      } else {
        reject();
        console.log("There was an error in assigning the data");
      }
    });

    assignment.then(() => {
      for (let i = 0; i < pcData.length; i++) {
        makeProfile(pcData[i],pcStats[i]);
      }
      makeProfile(dmData[0],dmStats);
      console.log("profiles finished");
    })
    .then(() => {
      for (let i = 0; i < pcData.length; i++) {
        pcStats[i].analyzeData();
      }
      console.log("profile data analyzed");
    });

  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function assignData(dataTable) {
  for (let i = 0; i < dataTable.length; i++) {
    for (let j = 0; j < pcArray.length; j++) {
      //match rows with the same alias
      if (dataTable[i][0].includes(pcArray[j])) {
        pcData[j].push(dataTable[i]);
        break; //break the for loop since there is only be one alias per row of data.
      } else if (dataTable[i][0] != "" && j == pcArray.length - 1){
        dmData[0].push(dataTable[i]); //if alias exists but is not part of names array, assume it is DM controlled character
      }
    }
  }

  return true;
}

function makeProfile(aliasData,profile) {
  /*
  this function takes a single set of pcData (or dmData) and synthesizes the data into a profile for a given profile of the global variable pcStats
  WARNING: profile and aliasData are linked to global variables. This function alters the given profile.
  aliasData = [0 "alias",1 "flavor",2 "advantageMode",3 "nDice",4 "faces",5 "total",6 "results"];
  */

  for (let i = 0; i < aliasData.length; i++) {
    //Check the flavor for keywords and then assign data appropriately
    let tempName;

    //if the number of faces is equal to 20, assign d20 data
    if (aliasData[i][4] == 20) {
      profile.d20Data.results.push(aliasData[i][6]);
      profile.d20Data.advantage.push(aliasData[i][2]);
    }

    //assign data depending on what is in "flavor"
    if (aliasData[i][1].includes("Damage")) {
      tempName = aliasData[i][1].split(" - ")[0]; //split up flavor and assign first half which is the name of the roll

      profile.damageData.total.push(aliasData[i][5]);
      profile.damageData.results.push(aliasData[i][6]);
      profile.damageData.name.push(tempName);
      profile.damageData.alias.push(aliasData[i][0]);
    } else if (aliasData[i][1].includes("Attack")) {
      //check for Attack 2nd because otherwise "Sneak Attack - Damage, gets added to attack rolls"
      tempName = aliasData[i][1].split(" - ")[0]; //split up flavor and assign first half which is the name of the attack used

      profile.attackData.total.push(aliasData[i][5]);
      profile.attackData.name.push(tempName);
      profile.attackData.alias.push(aliasData[i][0]);
    } else if (aliasData[i][1].includes("Check") || aliasData[i][1].includes("Saving")) {
      tempName = aliasData[i][1].split(":")[0]; //split up flavor and assign first half which is the name of the roll

      profile.skillData.total.push(aliasData[i][5]);
      profile.skillData.name.push(tempName);
      profile.skillData.alias.push(aliasData[i][0]);
    }
  }
}
