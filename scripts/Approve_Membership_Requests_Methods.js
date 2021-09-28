function getRSOs(userData){
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
        queryString = 'Select * from [dbo].[RSOs] Where Admin = ' + userData.recordset[0].UID;
        xhttp.send('queryString=' + queryString);
    });
}

function getMembershipRequests(inputRSOID){
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
        queryString = 'Select * from [dbo].[RSO_Join_Requests] Where RSOID = ' + inputRSOID;
        xhttp.send('queryString=' + queryString);
    });
}

function getUserInfo(inputUID){
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
        queryString = 'Select * from [dbo].[User] Where UID = ' + inputUID;
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

function insertTableContent(headerCellArray, cellTextArray, tableName, valueList) {
    var table = document.getElementById(tableName);
    var header = table.createTHead();
    var headerRow = header.insertRow();
    for (var i = 0; i < headerCellArray.length; i++){
        var cell = document.createElement("TH");
        if (headerCellArray[i] == "Phone_Number")
            cell.innerHTML = "Phone Number"
        else if (headerCellArray[i] == "RequestedRSO")
            cell.innerHTML = "Requested RSO"
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
                label.prepend(inputHTML);
                cell = row.insertCell();
                cell.appendChild(label);
            }
            else{
                cell = row.insertCell();
                cell.innerHTML = cellTextArray[i][j];
            }

            if (j == cellTextArray[0].length - 1){
                cell.setAttribute("id", "row" + i + "cell" + j);
            }
        }
    }
}

async function displayMembershipRequests(userDataString){
    userData = JSON.parse(userDataString);
    RSOIDlist = await getRSOs(userData);
    RSOIDlist = RSOIDlist.recordset;

    allRSOList = await getAllRSOs();
    allRSOList = allRSOList.recordset;
    membershipRequestList = [];

    // iterates for every RSO the admin is a part of
    for (var i = 0; i < RSOIDlist.length; i++){
        var partialRequestList = await getMembershipRequests(RSOIDlist[i].RSOID);
        partialRequestList = partialRequestList.recordset;

        // iterates for every request for a particular RSO
        for (var j = 0; j < partialRequestList.length; j++){
            var user = await getUserInfo(partialRequestList[j].UID);
            user.recordset[0].RequestedRSO = allRSOList[allRSOList.map(function(e) { return e.RSOID } ).indexOf(RSOIDlist[i].RSOID) ].Name;
            membershipRequestList.push(user.recordset[0]);
        }
    }

    var valueList = [];
    for (var i = 0; i < membershipRequestList.length; i++){
        valueList.push(membershipRequestList[i].UID);
    }

    var tableHeader = ["Name", "Email", "Phone_Number", "RequestedRSO"];
    var tableContent = createTableContent(tableHeader, membershipRequestList);
    insertTableContent(tableHeader, tableContent, "table_display", valueList);

}

function rejectRequest(inputUID, inputRSOID){
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
        queryString = 'Delete from [dbo].[RSO_Join_Requests] Where UID = ' + inputUID + ' AND RSOID = ' + inputRSOID;
        xhttp.send('queryString=' + queryString);
    });
}

function approveRequest(inputUID, inputRSOID){
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
        queryString = 'Insert into [dbo].[RSO_Memberships] values(' + inputRSOID + ', ' + inputUID + ')';
        xhttp.send('queryString=' + queryString);
    });
}

// returns true if number of members did not reach threshold (5)
function checkRSOMemberCount(RSOID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            count = parseInt(data.recordset[0][""]);
            if (count != 5)
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
        queryString = 'Update [dbo].[RSOs] Set Status = \'Active\' Where RSOID = ' + RSOID;
        xhttp.send('queryString=' + queryString);
    });
}


async function checkSubmit(){
    // number of rows in table without header
    numRows = document.getElementById("table_display").rows.length - 1;
    actionSelect = document.getElementById("select").options[document.getElementById("select").selectedIndex].value;
    allRSOList = await getAllRSOs();
    allRSOList = allRSOList.recordset;
    UIDList = [];
    RequestedRSONames = [];

    for(var i = 0; i < numRows; i++){
        var user = document.getElementById("row" + i + "cell0");
        if (user.checked)
        {
            UIDList.push(user.value);
            RequestedRSONames.push(document.getElementById("row" + i + "cell3").innerHTML);
        }
    }

    var RequestedRSOIDList = []
    for (var i = 0; i < RequestedRSONames.length; i++)
    {
        RequestedRSOIDList.push(allRSOList[allRSOList.map(function(e) { return e.Name } ).indexOf(RequestedRSONames[i]) ].RSOID)
    }

    if (UIDList.length == 0){
        alert("Please select applicants to approve/reject");
        return;
    }

    if (actionSelect == "Reject"){
        for (var i = 0; i < UIDList.length; i++)
            var result = await rejectRequest(UIDList[i], RequestedRSOIDList[i]);
    }
    else{
        for (var i = 0; i < UIDList.length; i++){
            var result = await approveRequest(UIDList[i], RequestedRSOIDList[i]);
            // removes the request
            result = await rejectRequest(UIDList[i], RequestedRSOIDList[i]);
            result = await checkRSOMemberCount(RequestedRSOIDList[i]);
            if (!result){
                result = await changeRSOStatus(RequestedRSOIDList[i]);
                alert(RequestedRSONames[i].trim() + "\'s status was changed to \"Active\"");
            }
        }
    }

    alert("Approval/Rejection Successful");
    submitform('Home', userAccessString, userDataString);
    
}
