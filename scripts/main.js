const diceTypes = ["d100","d20","d12","d10","d8","d6","d4","d2"];
const dataNames = ["alias","flavor","advantageMode","nDice","faces","result"];
const pcArray = ["Brotir","Berserker"];
let pcStats = [...Array(pcArray.length)];
pcStats.fill([]);
console.log(pcStats);


function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    let rawArray = reader.result.split("\n");

    let dataTable = new Array(rawArray.length);

    //create a table of values from the info
    for (let i = 0; i < rawArray.length; i++) {
      dataTable[i] = rawArray[i].split(",");
      //turn blank numbers into 0 and number strings into integers
      for (let j = 2; j < dataTable[i].length; j++) {
        if (dataTable[i][j] == "") {
          dataTable[i][j] = 0;
          continue;
        }
        dataTable[i][j] = parseInt(dataTable[i][j]);
      }
    }

    console.log(rawArray);
    console.log(dataTable);
    parseData(dataTable);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function parseData(dataTable) {
  for (let i = 0; i < dataTable.length; i++) {
    for (let j = 0; j < pcArray.length; j++) {
      //match rows with the same alias

      if (dataTable[i][0] == pcArray[j]) {
        console.log("dataTable[" + i + "][0]: " + dataTable[i][0] + " pcArray[" + j + "]: " + pcArray[j]);
        pcStats[j].push(dataTable[i]);
      }
    }
  }

  /*
  count = 0;
  for (let i = 0; i < rawArray.length; i++) {
    if (rawArray[i].includes('Brotir')) {
      count++;
    }
  }
  console.log("Brotir appears " + count + " times!");
  */
}

function getRoll(rawSingle) {
  let num = 0, dice = null, roll = 0, total = 0;
  for (x in diceTypes) {
    if (rawSingle.includes(x)) {
      dice = x;
    }
  }
}
