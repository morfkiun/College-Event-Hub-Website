function getRSOs(UID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select RSOID from [dbo].[RSO_Memberships] Where UID = ' + UID;
        xhttp.send('queryString=' + queryString);
    });
}

function getAllRSOs(){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select * from [dbo].[RSOs]';
        xhttp.send('queryString=' + queryString);
    });
}


function createTableContent(tableHeader, arr){
    var tableContent = [];

    for (var i = 0; i < arr.length; i++){
        var tableRow = [];
        // add properties to table that are indicated in tableHeader
        for (var prop in arr[0]) {
            if (Object.prototype.hasOwnProperty.call(arr[0], prop)) {
                if(tableHeader.indexOf(prop) != -1)
                    tableRow.push(arr[i][prop]);
            }
        }
        tableContent.push(tableRow);
    }

    return tableContent;
}

function insertTableContent(headerCellArray, cellTextArray, valueList) {
    var table = document.getElementById('table_display');
    var header = table.createTHead();
    var headerRow = header.insertRow();
    for (var i = 0; i < headerCellArray.length; i++){
        var cell = document.createElement("TH");
        if (headerCellArray[i] == "Name")
            cell.innerHTML = "RSO Name";
        else
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
                var inputHTML = document.createElement("input");
                inputHTML.setAttribute("type", "checkbox");
                inputHTML.setAttribute("id", "row" + i + "cell" + j);
                inputHTML.setAttribute("value", valueList[i]);
                inputHTML.setAttribute("name", cellTextArray[i][j]);
                label.prepend(inputHTML);
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

async function displayRSOs(){
    userData = JSON.parse(userDataString);
    RSOList = await getRSOs(userData.recordset[0].UID);
    allRSOs = await getAllRSOs();
    allRSOs = allRSOs.recordset;
    var RSOIDList = [];
    for(var i = 0; i < RSOList.recordset.length; i++)
        RSOIDList.push(RSOList.recordset[i].RSOID);

    var RSONameList = [];
    for (var i = 0; i < RSOIDList.length; i++){
        RSONameList.push(allRSOs[allRSOs.map(function(e) { return e.RSOID } ).indexOf(RSOIDList[i])]);
    }
    var tableHeader = ["Name"];
    var tableContent = createTableContent(tableHeader, RSONameList);
    insertTableContent(tableHeader, tableContent, RSOIDList)
    //console.log(document.getElementById("row0cell0").value);

}

function leaveRSO(RSOID, UID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Delete from [dbo].[RSO_Memberships] Where UID = ' + UID + ' AND RSOID = ' + RSOID;
        xhttp.send('queryString=' + queryString);
    });
}

// returns true if number of members did not cross threshold (5)
function checkRSOMemberCount(RSOID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            count = parseInt(data.recordset[0][""]);
            if (count != 4)
                resolve(true);
            else
                resolve(false);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select Count(UID) from [dbo].[RSO_Memberships] Where RSOID = ' + RSOID;
        xhttp.send('queryString=' + queryString);
    });
}

function changeRSOStatus(RSOID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Update [dbo].[RSOs] Set Status = \'Inactive\' Where RSOID = ' + RSOID;
        xhttp.send('queryString=' + queryString);
    });
}

async function checkSubmit(){
    numRows = document.getElementById("table_display").rows.length - 1;

    RSOIDs = [];
    RSONames = [];
    for(var i = 0; i < numRows; i++){
        var selection = document.getElementById("row" + i + "cell0");
        if (selection.checked)
        {
            RSOIDs.push(selection.value);
            RSONames.push(selection.name);
        }
    }

    if (RSOIDs.length == 0){
        alert("Please select RSOs to leave");
        return;
    }

    userData = JSON.parse(userDataString);
    for (var i = 0; i < RSOIDs.length; i++){
        var result = await leaveRSO(RSOIDs[i], userData.recordset[0].UID);
        check = await checkRSOMemberCount(RSOIDs[i])
        if (!check){
            result = await changeRSOStatus(RSOIDs[i]);
            alert(RSONames[i].trim() + "\'s status was changed to \"Inactive\"");
        }
    }

    alert("RSOs were successfully removed from your memberships");

    submitform('Manage_Memberships', userAccessString, userDataString)


}