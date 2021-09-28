function fillSelect(tableName, selectNameAttribute, selectValueAttribute, selectID, defaultString){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        insertSelectOptions(selectID, defaultString, data.recordset, selectNameAttribute, selectValueAttribute);
    }
    };
    xhttp.open("POST", "/query", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    queryString = 'Select * From [dbo].[' + tableName + ']';
    xhttp.send('queryString=' + queryString);
}

function insertSelectOptions(selectID, defaultString, list, selectNameAttribute, selectValueAttribute){
    var selectList = document.getElementById(selectID);

    //insert default value first
    var option = document.createElement('option');
    option.label = defaultString;
    option.setAttribute('value', defaultString);
    selectList.appendChild(option);

    for (var i = 0; i < list.length; i++){
        option = document.createElement('option');
        option.setAttribute('label', list[i][selectNameAttribute]);
        option.setAttribute('value', list[i][selectValueAttribute]);
        selectList.appendChild(option);
    }
}

async function checkSubmit(userDataString){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        alert("Event Successfully Created");
        submitform('Home', userAccessString, userDataString);
    }
    };
    xhttp.open("POST", "/query", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    LID = document.getElementById("location_select").options[document.getElementById("location_select").selectedIndex].value;
    newID = await getNewID("EID", "Events");
    eventName = document.getElementById("event_name").value;
    date = document.getElementById("date").value;
    startTime = document.getElementById("start_time").value;
    endTime = document.getElementById("end_time").value;
    description = document.getElementById("description").value;

    userData = JSON.parse(userDataString);
    phone = userData.recordset[0].Phone_Number;
    email = userData.recordset[0].Email;
    hostUniversity = await getUniversityAffiliation(userData.recordset[0].UID);
    eventType = document.getElementById("event_type_select").options[document.getElementById("event_type_select").selectedIndex].value;
    hostRSO = document.getElementById("RSO_select").options[document.getElementById("RSO_select").selectedIndex].value;

    if (hostRSO != "none"){
        membership = await checkRSOMembership(userData.recordset[0].UID, hostRSO);
        if (!membership){
            alert("You are not allowed to create an event for this RSO");
            return;
        }
    }
    else
        hostRSO = "NULL";

    if (!await checkValidity(LID, date, startTime, endTime))
        return;

    queryString = 'Insert into [dbo].[Events] values(' + LID + ', ' + newID + ', \'' + eventName + '\', \'' + date + '\', \'' + startTime + '\', \'' 
                    + endTime + '\', \'' + description + '\', \'' + phone + '\', \'' + email + '\', ' + hostUniversity + ', \'' + eventType + '\', ' + hostRSO + ')';
    xhttp.send('queryString=' + queryString);
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

function getUniversityAffiliation(UID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(parseInt(data.recordset[0]["UNIID"]));
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select UNIID from [dbo].[University_Affiliation] Where UID = ' + UID;
        xhttp.send('queryString=' + queryString);
    });
}

function checkRSOMembership(UID, inputRSOID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            found = false;
            for (var i = 0; i < data.recordset.length; i++){
                if (parseInt(data.recordset[i]["RSOID"]) == inputRSOID){
                    found = true;
                    break;
                }
            }

            resolve(found);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select RSOID from [dbo].[RSO_Memberships] Where UID = ' + UID;
        xhttp.send('queryString=' + queryString);
    });
}

function getAllEvents(){
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
        queryString = 'Select * from [dbo].[Events]';
        xhttp.send('queryString=' + queryString);
    });
}

async function checkValidity(LID, date, inputStartTime, inputEndTime){
    allEvents = await getAllEvents();
    allEvents = allEvents.recordset;

    inputStartTime = inputStartTime.split(":");
    inputStartHour = parseInt(inputStartTime[0]);
    inputStartMinute = parseInt(inputStartTime[1]);

    inputEndTime = inputEndTime.split(":");
    inputEndHour = parseInt(inputEndTime[0]);
    inputEndMinute = parseInt(inputEndTime[1]);

    for (var i = 0; i < allEvents.length; i++){
        if(allEvents[i].Date.trim() == date && allEvents[i].LID == LID){
            
            startTime = allEvents[i]["Start Time"].trim().split(":");
            endTime = allEvents[i]["End Time"].trim().split(":");;
            startHour = parseInt(startTime[0]);
            startMinute = parseInt(startTime[1]);
            endHour = parseInt(endTime[0]);
            endMinute = parseInt(endTime[1]);

            // checks start time of input event
            if (inputStartHour >= startHour && inputStartHour <= endHour)
                {
                    if(inputStartHour == startHour && inputStartMinute < startMinute){

                    }
                    else if(inputStartHour == endHour && inputStartMinute >= endMinute){

                    }

                    else{
                        alert("The event conflicts with another event held at the same location and date, which starts from " + allEvents[i]["Start Time"].trim()
                        + " until " + allEvents[i]["End Time"].trim());
                        return false;
                    }

                }
            // checks end time of input event
            if (inputEndHour >= startHour){
                    if(inputEndHour == startHour && inputEndMinute < startMinute){

                    }
                    else
                    {
                        alert("The event conflicts with another event held at the same location and date, which starts from " + allEvents[i]["Start Time"].trim()
                            + " until " + allEvents[i]["End Time"].trim());
                        return false;
                    }
            }
        }
    }

    return true

}


