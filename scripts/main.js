
function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    console.log(reader.result);

    let rawArray = reader.result.split("---------------------------");
    console.log(rawArray[0]);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function parseData(raw) {

}
