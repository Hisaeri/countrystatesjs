var fs = require('fs');

var states = [];

function addPostCode(state, stateNb) {
    for (var i = 0; i < states[stateNb].districts.length; i++) {
        if (states[stateNb].districts[i].district === state.district) {
            // found this district already! just add postal code to its zip list
            states[stateNb].districts[i].postal_codes.push(state.zip);
            return true;
        }
    }
    // district not found already! push it to the province
    states[stateNb].districts.push({
        "district": state.district,
        "postal_codes": [state.zip]
    });
    return false;
}

function addDistrict(state) {
    for (var i = 0; i < states.length; i++) {
        if (states[i].name === state.province) {

            //  province already exists, push district
            addPostCode(state, i);
            return true;
        }
    }
    // province doesnt exists, push district and its postal code
    states.push({
        "name": state.province,
        "districts": [{ "district": state.district, "postal_codes": [state.zip] }]
    });
    return false;
}

// Format JSON data file
function formatData(data) {
    for (var i = 0; i < data.length; i++) {
        var state = data[i];
        if (!addDistrict(state)) {
            console.log('new province has been added : ', state.province)
        }
    }
}

// Read from JSON data file
function readData() {
    var rawdata = fs.readFileSync('thai_db.json');
    var data = JSON.parse(rawdata);
    return data;
}

formatData(readData());

try {
    fs.writeFile('formatted_th_provinces.json', JSON.stringify({ states }), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
} catch {
    console.log('error');
}