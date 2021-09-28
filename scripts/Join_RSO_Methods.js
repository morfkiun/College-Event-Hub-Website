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
        alert("Request Successfully Created");
        submitform('Home', userAccessString, userDataString);
    }
    };
    xhttp.open("POST", "/query", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    userData = JSON.parse(userDataString);
    RSOID = document.getElementById("RSO_select").options[document.getElementById("RSO_select").selectedIndex].value;

    if (await checkMembership(userData.recordset[0].UID, RSOID))
    {
        alert("You are already a member of the selected RSO. Please choose another RSO.");
        return;
    }
    queryString = 'Insert into [dbo].[RSO_Join_Requests] values(' + parseInt(userData.recordset[0].UID) + ', ' + RSOID + ')';
    xhttp.send('queryString=' + queryString);
}

function checkMembership(inputUID, inputRSOID){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            // true if user is already a member
            if (data.recordset.length > 0)
                resolve(true);
            else
                resolve(false);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select * from [dbo].[RSO_Memberships] where RSOID = ' + inputRSOID + ' AND UID = ' + inputUID;
        xhttp.send('queryString=' + queryString);
    });
}
