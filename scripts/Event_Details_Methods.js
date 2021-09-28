function getEventDetails(EID){
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
        queryString = 'Select * from [dbo].[Events] Where EID = ' + EID;
        xhttp.send('queryString=' + queryString);
    });
}

function getUniversityName(inputUNIID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data.recordset[0]["Name"]);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select Name from [dbo].[University] Where UNIID = ' + inputUNIID;
        xhttp.send('queryString=' + queryString);
    });
}

function getRSOName(inputRSOID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data.recordset[0]["Name"]);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select Name from [dbo].[RSOs] Where RSOID = ' + inputRSOID;
        xhttp.send('queryString=' + queryString);
    });
}

function getEventComments(EID){
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
        queryString = 'Select * from [dbo].[Comments] Where EID = ' + EID;
        xhttp.send('queryString=' + queryString);
    });
}

function getUserName(inputUID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data.recordset[0]["Name"]);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select Name from [dbo].[User] Where UID = ' + inputUID;
        xhttp.send('queryString=' + queryString);
    });
}

function getUserComment(inputEID, inputUID){
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
        queryString = 'Select * from [dbo].[Comments] Where EID = ' + inputEID + ' AND UID = ' + inputUID;
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
        if (headerCellArray[i] == "Host_University")
            cell.innerHTML = "Host University"
        else if (headerCellArray[i] == "Host_RSO")
            cell.innerHTML = "Host RSO"
        else if (headerCellArray[i] == "Event_Type")
            cell.innerHTML = "Event Type"
        else if (headerCellArray[i] == "Date")
            cell.innerHTML = "Date (YYYY-MM-DD)"
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
            // if cell is a timestamp, convert it
            if (j == 2 && headerCellArray[2] == "Timestamp"){
                cell = row.insertCell();
                cell.innerHTML = new Date(cellTextArray[i][j]);
            }
            else {
                cell = row.insertCell();
                cell.innerHTML = cellTextArray[i][j];
            }
        }
    }
}

async function displayPageInfo(inputEID){
    eventDetails = await getEventDetails(inputEID);
    eventDetails = eventDetails.recordset;
    eventDetails[0]["Host_University"] = await getUniversityName(eventDetails[0]["Host_University"]);
    if (eventDetails[0]["Host_RSO"] != null)
        eventDetails[0]["Host_RSO"] = await getRSOName(eventDetails[0]["Host_RSO"]);
    else
        eventDetails[0]["Host_RSO"] = "none";
    var tableHeader = ["Name", "Date", "Start Time", "End Time" ,"Description",  "Contact Phone Number", "Contact Email Address", "Host_University", "Event_Type", "Host_RSO"];
    var tableContent = createTableContent(tableHeader, eventDetails);
    insertTableContent(tableHeader, tableContent, "event_details_table");

    allComments = await getEventComments(inputEID);
    allComments = allComments.recordset;
    for (var i = 0; i < allComments.length; i++)
        allComments[i].Name = await getUserName(allComments[i].UID)

    tableHeader = ["Rating", "Comment", "Timestamp", "Name"];
    tableContent = createTableContent(tableHeader, allComments);
    insertTableContent(tableHeader, tableContent, "all_comments_table");

    userData = JSON.parse(userDataString);
    userComment = await getUserComment(inputEID, userData.recordset[0].UID);
    userComment = userComment.recordset;

    // executes if user comment exists already
    if (userComment.length != 0){
        ratingSelect = document.getElementById("rating_select");
        for (var i = 0; i < ratingSelect.length; i++){
            if (ratingSelect.options[i].value == userComment[0]["Rating"]){
                ratingSelect.value = ratingSelect.options[i].value;
            }
        }

        document.getElementById("user_comment").innerHTML = userComment[0]["Comment"];
        document.getElementById("timestamp_cell").innerHTML = new Date (userComment[0]["Timestamp"]);
    }

}

function deleteUserComment(inputEID, inputUID){
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
        queryString = 'Delete from [dbo].[Comments] Where EID = ' + inputEID + ' AND UID = ' + inputUID;
        xhttp.send('queryString=' + queryString);
    });
}

function InsertUserComment(inputEID, inputUID, rating, comment, timestamp){
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
        queryString = 'Insert into [dbo].[Comments] values(' + inputUID + ', ' + inputEID + ', ' + rating + ', \'' + comment +'\', ' + timestamp +')';
        xhttp.send('queryString=' + queryString);
    });
}

async function checkSubmit(inputEID){
    ratingSelect = document.getElementById("rating_select");
    userData = JSON.parse(userDataString);
    result = await deleteUserComment(inputEID, userData.recordset[0].UID);
    var date = new Date();
    result = await InsertUserComment(inputEID, userData.recordset[0].UID, ratingSelect.value, document.getElementById("user_comment").value, date.getTime());
    alert("Comment Successfully Saved");
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

async function deleteUserCommentButton(inputEID){
    userData = JSON.parse(userDataString);
    result = await deleteUserComment(inputEID, userData.recordset[0].UID);
    alert("Comment Successfully Deleted");
    submitformComment('Event_Details', userAccessString, userDataString, inputEID);
}
