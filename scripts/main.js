const diceTypes = ["d100","d20","d12","d10","d8","d6","d4","d2"];
const dataNames = ["alias","flavor","advantageMode","nDice","faces","result"];


function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {

    let rawArray = reader.result.split("\n");

    let dataTable = new Array(rawArray.length);
    for (let i = 0; i < rawArray.length; i++) {
      dataTable[i] = rawArray[i].split(",");
    }

    console.log(rawArray);
    console.log(dataTable);
    parseData(rawArray);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function parseData(rawArray) {
  count = 0;
  for (let i = 0; i < rawArray.length; i++) {
    if (rawArray[i].includes('Brotir')) {
      count++;
    }
  }
  console.log("Brotir appears " + count + " times!");
}

function getRoll(rawSingle) {
  let num = 0, dice = null, roll = 0, total = 0;
  for (x in diceTypes) {
    if (rawSingle.includes(x)) {
      dice = x;
    }
  }
}
