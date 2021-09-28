function initializeEventListenersForSearchEvents(userAccessString, userDataString){
    document.getElementById("search_by_location").addEventListener("click", function() {
      searchEvents(userAccessString, userDataString, "Host_University");
    });
    document.getElementById("search_by_university").addEventListener("click", function() { 
      searchEvents(userAccessString, userDataString, "none");
    });
}

// retrives all events user is eligible for and displays them in the table based on the attribute
function searchEvents(userAccessString, userDataString, attribute){

    removeAllChildren("table_display");
    document.getElementById("submit_button").style.display = "inline";
    document.getElementById("submit_button_label").style.display = "inline";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        document.getElementById("table_display").style.display = "block";
        var tableHeader = ["Name", "Date", "Start Time", "End Time", "Description", "Contact Phone Number", "Contact Email Address"];
        filteredData = data;
        if (attribute == "Host_University")
            filteredData = filterEventData(data, attribute, data.UNIID);
        var tableContent = createEventTableContent(tableHeader, filteredData);

        EIDList = [];
        var eventStrings = ["PublicEvents", "PrivateEvents", "RSOEvents"];
        for (var i = 0; i < eventStrings.length; i++){
            for (var j = 0; j < filteredData[eventStrings[i]].recordset.length; j++){
                EIDList.push(filteredData[eventStrings[i]].recordset[j].EID);
            }
        }

        insertEventTableContent(tableHeader, tableContent, EIDList);
        if (attribute == "Host_University")
            insertSelectOptions("All Locations", filteredData.Locations.recordset, "LID", data);
        else
            insertSelectOptions("All Universities", filteredData.Universities.recordset, "UNIID", data);
    }
    };
    xhttp.open("POST", "/searchEvents", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('userAccess=' + userAccessString + '&userData=' + userDataString);
}

function removeAllChildren(elementID){
    var element = document.getElementById(elementID);
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function filterEventData(data, attribute, attributeValue){
    var eventStrings = ["PublicEvents", "PrivateEvents", "RSOEvents"];

    //copy data without reference to it
    selectedData = JSON.stringify(data);
    selectedData = JSON.parse(selectedData);
    
    for (var z = 0; z < eventStrings.length; z++){
        var i = 0;
        while(i < selectedData[eventStrings[z]].recordset.length){

            // some values may have extra trailing spaces in recordset in strings: use .trim()
            if (typeof selectedData[eventStrings[z]].recordset[i][attribute] == "string")
                selectedData[eventStrings[z]].recordset[i][attribute] = selectedData[eventStrings[z]].recordset[i][attribute].trim();

            if (typeof attributeValue == "string")
                attributeValue = attributeValue.trim();
            
            // delete events that do not meet attribute requirements
            if (selectedData[eventStrings[z]].recordset[i][attribute] != attributeValue){
                selectedData[eventStrings[z]].recordset.splice(i, 1);
                continue;
            }
            i++;
        }
    }

    // Remove Locations in Locations that do not appear in filtered events
    var i = 0;
    while(i < selectedData.Locations.recordset.length){
        LID = selectedData.Locations.recordset[i].LID
        found = false;

        for (var z = 0; z < eventStrings.length; z++){
            for(var eventIndex in selectedData[eventStrings[z]].recordset){
                if (selectedData[eventStrings[z]].recordset[eventIndex].LID == LID)
                    found = true;
                    break;
            }
        }

        if (!found){
            selectedData.Locations.recordset.splice(i, 1);
            continue;
        }
        i++;
    }

    // Remove universities in universities that do not appear in filtered events
    var i = 0;
    while(i < selectedData.Universities.recordset.length){
        UNIID = selectedData.Universities.recordset[i].UNIID
        found = false;

        for (var z = 0; z < eventStrings.length; z++){
            for(var eventIndex in selectedData[eventStrings[z]].recordset){
                if (selectedData[eventStrings[z]].recordset[eventIndex].Host_University == UNIID)
                    found = true;
                    break;
            }
        }

        if (!found){
            selectedData.Universities.recordset.splice(i, 1);
            continue;
        }
        i++;
    }

    return selectedData;
}

function createEventTableContent(tableHeader, data){
    var tableContent = [];
    var eventStrings = ["PublicEvents", "PrivateEvents", "RSOEvents"];

    // iterates through each type of event
    for (var z = 0; z < eventStrings.length; z++){
        // iterates through all events in an event type
        for (var i = 0; i < data[eventStrings[z]].recordset.length; i++){
            // do not add event to table if it does not meet the filter requirements
            var tableRow = [];
            // add event properties to table that are indicated in tableHeader
            for (var prop in data[eventStrings[z]].recordset[0]) {
                if (Object.prototype.hasOwnProperty.call(data[eventStrings[z]].recordset[0], prop)) {
                    if(tableHeader.indexOf(prop) != -1)
                        tableRow.push(data[eventStrings[z]].recordset[i][prop]);
                }
            }
            tableContent.push(tableRow);
        }
    }

    return tableContent;
}

function insertEventTableContent(headerCellArray, cellTextArray, valueList) {
    var table = document.getElementById("table_display");
    var header = table.createTHead();
    var headerRow = header.insertRow();
    for (var i = 0; i < headerCellArray.length; i++){
        var cell = document.createElement("TH");
        cell.innerHTML = headerCellArray[i];
        headerRow.appendChild(cell);
    }
    //var row = table.insertRow();
    //var cell1 = row.insertCell(0);
    //var cell2 = row.insertCell(1);
    //cell1.innerHTML = "NEW CELL1";
    //cell2.innerHTML = "NEW CELL2";

    for (var i = 0; i < cellTextArray.length; i++){
        var row = table.insertRow();
        for (var j = 0; j < cellTextArray[0].length; j++){
            var cell = undefined;
            if(j == 0){
                var label = document.createElement("label");
                label.innerHTML = cellTextArray[i][j];
                var radio = document.createElement("input");
                radio.setAttribute("type", "radio");
                radio.setAttribute("id", "row" + i + "cell" + j);
                radio.setAttribute("name", "radio");
                radio.setAttribute("value", valueList[i]);
                label.prepend(radio);
                cell = row.insertCell();
                cell.appendChild(label);
            }
            else{
                cell = row.insertCell();
                cell.innerHTML = cellTextArray[i][j];
            }
        }
    }
}

function insertSelectOptions(defaultString, list, attribute, data){
    document.getElementById("select_label").style.display = "block";
    if (attribute == "LID")
        document.getElementById("select_label").innerHTML = "Type and select a location to filter:";
    else
        document.getElementById("select_label").innerHTML = "Type and select an university to filter:";
    var selectList = document.getElementById('select');
    selectList.style.display = "block";
    removeAllChildren("select");

    //insert default value first
    var option = document.createElement('option');
    option.label = defaultString;
    option.setAttribute('value', defaultString);
    selectList.appendChild(option);

    for (var i = 0; i < list.length; i++){
        option = document.createElement('option');
        option.setAttribute('label', list[i].Name);
        option.setAttribute('value', list[i][attribute]);
        selectList.appendChild(option);
    }

    attributeAttribute = attribute;
    selectList.setAttribute('onchange', 'optionSelected(data, attributeAttribute)');
}

function optionSelected(data, attribute){
    var selectList = document.getElementById('select');

    if (selectList.selectedIndex != 0)
    {
        removeAllChildren("table_display");
        attributeValue = selectList.options[selectList.selectedIndex].value;
        if (attribute == "UNIID")
            attribute = "Host_University";
        var tableHeader = ["Name", "Date", "Start Time", "End Time", "Description", "Contact Phone Number", "Contact Email Address"];
        //console.log(attribute, attributeValue);
        filteredData = filterEventData(data, attribute, attributeValue);
        var tableContent = createEventTableContent(tableHeader, filteredData);

        EIDList = [];
        var eventStrings = ["PublicEvents", "PrivateEvents", "RSOEvents"];
        for (var i = 0; i < eventStrings.length; i++){
            for (var j = 0; j < filteredData[eventStrings[i]].recordset.length; j++){
                EIDList.push(filteredData[eventStrings[i]].recordset[j].EID);
            }
        }
        insertEventTableContent(tableHeader, tableContent, EIDList);
    }

    // executes when All Locations / All Universities options are selected
    else{
        removeAllChildren("table_display");
        var tableHeader = ["Name", "Date", "Start Time", "End Time", "Description", "Contact Phone Number", "Contact Email Address"];
        filteredData = data;
        if (attribute == "LID")
            filteredData = filterEventData(data, "Host_University", data.UNIID);
        var tableContent = createEventTableContent(tableHeader, filteredData);

        EIDList = [];
        var eventStrings = ["PublicEvents", "PrivateEvents", "RSOEvents"];
        for (var i = 0; i < eventStrings.length; i++){
            for (var j = 0; j < filteredData[eventStrings[i]].recordset.length; j++){
                EIDList.push(filteredData[eventStrings[i]].recordset[j].EID);
            }
        }
        insertEventTableContent(tableHeader, tableContent, EIDList);
        if (attribute == "LID")
            insertSelectOptions("All Locations", filteredData.Locations.recordset, "LID", data);
        else
            insertSelectOptions("All Universities", filteredData.Universities.recordset, "UNIID", data);
    }

}

function checkSubmit(){
    // number of rows in table without header
    numRows = document.getElementById("table_display").rows.length - 1;
    inputEID = undefined;

    for(var i = 0; i < numRows; i++){
        var eventCell = document.getElementById("row" + i + "cell0");
        if (eventCell.checked)
        {
            inputEID = eventCell.value;
            break;
        }
    }

    if (inputEID == undefined){
        alert("Please select an event to see more details");
        return;
    }

    submitformComment('Event_Details', userAccessString, userDataString, inputEID);
    
}

function submitformComment(page, userAccessString, userDataString, EID) {
    var form = document.createElement("FORM");
    url = '/navBar';
    form.setAttribute("action", url);
    form.setAttribute("method", "post");

    var userData = document.createElement("input");
    userData.setAttribute("type", "hidden");
    userData.setAttribute("name", "userData");
    userData.setAttribute("value", userDataString);

    var userAccess = document.createElement("input");
    userAccess.setAttribute("type", "hidden");
    userAccess.setAttribute("name", "userAccess");
    userAccess.setAttribute("value", userAccessString);

    var page_input = document.createElement("input");
    page_input.setAttribute("type", "hidden");
    page_input.setAttribute("name", "page");
    page_input.setAttribute("value", page);

    var EID_input = document.createElement("input");
    EID_input.setAttribute("type", "hidden");
    EID_input.setAttribute("name", "EID");
    EID_input.setAttribute("value", EID);

    var s = document.createElement("input");
    s.setAttribute("type", "submit");
    s.setAttribute("value", "Submit");

    form.appendChild(userData);
    form.appendChild(userAccess);
    form.appendChild(page_input);
    form.appendChild(EID_input);
    form.appendChild(s);
    document.body.appendChild(form);
    form.submit();
}

