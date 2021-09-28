function getRSORequests(){
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
        queryString = 'Select * from [dbo].[RSO_Create_Requests]';
        xhttp.send('queryString=' + queryString);
    });
}

function getUserInfo(email){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data.recordset[0]);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select * from [dbo].[User] Where Email = \'' + email + '\'';
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

function insertTableContent(headerCellArray, cellTextArray, tableName) {
    var table = document.getElementById(tableName);
    var header = table.createTHead();
    var headerRow = header.insertRow();
    for (var i = 0; i < headerCellArray.length; i++){
        var cell = document.createElement("TH");
        if (headerCellArray[i] == "Phone_Number")
            cell.innerHTML = "Phone Number"
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
            cell = row.insertCell();
            cell.innerHTML = cellTextArray[i][j];
        }
    }
}

function createRSOTables(requestListWithInfo){
    //var body = document.getElementsByTagName('body')[0];
    var body = document.getElementById('table_section');
    for (var i = 0; i < requestListWithInfo.length; i++){
        var inputHTML = document.createElement("input");
        inputHTML.setAttribute("type", "checkbox");
        inputHTML.setAttribute("id", i);
        inputHTML.setAttribute("value", requestListWithInfo[i]["Name"]);

        var label = document.createElement("label");
        label.innerHTML = "<b>RSO Name:</b>  " + requestListWithInfo[i]["Name"];
        label.prepend(inputHTML);
        body.append(label);

        var tbl = document.createElement('table');
        tbl.setAttribute("id", "table" + i);
        body.appendChild(tbl)
        var tableHeader = ["Name", "Email", "Phone_Number"];
        var tableContent = createTableContent(tableHeader, requestListWithInfo[i]["memberArr"]);
        insertTableContent(tableHeader, tableContent, "table" + i);

        lineBreak = document.createElement('BR');
        body.append(lineBreak);
        body.append(lineBreak);
    }

}

function initializeEventListeners(requestListWithInfo){
    document.getElementById("submit_button").addEventListener("click", function() {
        checkSubmit(requestListWithInfo);
    });
}

async function displayRSORequests(){

    requestList = await getRSORequests();
    requestList = requestList.recordset;

    requestListWithInfo = [];

    for (var i = 0; i < requestList.length; i++){
        var RSO = {};
        RSO.Name = requestList[i]["Name"];
        var memberArr = [];
        //iterate through 5 members
        for(var j = 1; j <= 5; j++){
            var member = await getUserInfo(requestList[i]["Member " + j + " Email"]);
            memberArr.push(member);
        }
        // add admin
        RSO.memberArr = memberArr;

        var admin = await getUserInfo(requestList[i]["Admin Email"]);
        RSO.Admin = admin;

        requestListWithInfo.push(RSO);
    }

    createRSOTables(requestListWithInfo);

    initializeEventListeners(requestListWithInfo);
}

function rejectRequest(RSOName, adminEmail){
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
        queryString = 'Delete from [dbo].[RSO_Create_Requests] Where Name = \'' + RSOName + '\' AND [Admin Email] = \'' + adminEmail + '\'';
        xhttp.send('queryString=' + queryString);
    });
}

function getNewID(IDname, tableName){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(parseInt(data.recordset[0][""]) + 1);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select Max(' + IDname + ') from [dbo].[' + tableName +']';
        xhttp.send('queryString=' + queryString);
    });
}

function insertMembership(RSOID, UID){
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
        queryString = 'Insert into [dbo].[RSO_Memberships] values(' + RSOID + ", " + UID + ')';
        xhttp.send('queryString=' + queryString);
    });
}

function insertRSO(RSOID, AdminUID, RSOName){
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
        queryString = 'Insert into [dbo].[RSOs] values(' + RSOID + ", " + AdminUID + ', \'' + RSOName + '\', \'Active\')';
        xhttp.send('queryString=' + queryString);
    });
}

function createAdmin(UID){
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
        queryString = 'Update [dbo].[User] Set User_Type = \'Admin\' Where UID = ' + UID;
        xhttp.send('queryString=' + queryString);
    });
}

async function approveRequest(requestListWithInfo, RSOName, position){
    newID = await getNewID("RSOID", "RSOs");
    AdminUID = requestListWithInfo[position]["Admin"].UID;
    result = await insertRSO(newID, AdminUID, RSOName);

    for (var i = 0; i < requestListWithInfo[position]["memberArr"].length; i++){
        result = await insertMembership(newID, requestListWithInfo[position]["memberArr"][i].UID);
    }

    result = await createAdmin(requestListWithInfo[position]["Admin"].UID);
}


async function checkSubmit(requestListWithInfo){
    actionSelect = document.getElementById("select").options[document.getElementById("select").selectedIndex].value;
    if (actionSelect == ""){
        alert("Please choose approve or reject");
        return;
    }

    // number of rows in table without header
    numCheckboxes = requestListWithInfo.length;
    RSONames = [];

    for(var i = 0; i < numCheckboxes; i++){
        var name = document.getElementById(i);
        if (name.checked)
        {
            RSONames.push(name.value);
        }
    }

    if (RSONames.length == 0){
        alert("Please select RSOs to approve/reject");
        return;
    }

    if (actionSelect == "Reject"){
        for (var i = 0; i < RSONames.length; i++)
            var result = await rejectRequest(RSONames[i], requestListWithInfo[requestListWithInfo.map(function(e) { return e.Name } ).indexOf(RSONames[i])]["Admin"].Email);
    }
    else{
        for (var i = 0; i < RSONames.length; i++){
            var result = await approveRequest(requestListWithInfo, RSONames[i], requestListWithInfo.map(function(e) { return e.Name } ).indexOf(RSONames[i]));
            // removes the request
            result = await rejectRequest(RSONames[i], requestListWithInfo[requestListWithInfo.map(function(e) { return e.Name } ).indexOf(RSONames[i])]["Admin"].Email);
        }
    }

    alert("Approval/Rejection Successful");
    submitform('Home', userAccessString, userDataString);
    
}
