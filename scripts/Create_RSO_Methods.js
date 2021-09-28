function checkEmailsInSystem(allEmails){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            resolve(data.recordset.length == 4);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select * from [dbo].[User] Where ';

        for (var i = 0; i < allEmails.length; i++){
            queryString = queryString.concat('Email = \'' + allEmails[i] + '\'');
            if (i < allEmails.length - 1)
                queryString = queryString.concat(' OR ');
        }
        xhttp.send('queryString=' + queryString);
    });
}

function checkAllEmailsSameDomain(allEmails){
    domain = allEmails[0].slice(allEmails[0].indexOf('@'));
    for (var i = 1; i < allEmails.length; i++){
        if (allEmails[i].indexOf(domain) == -1)
            return false;
    }
    return true;
}

function makeRequest(allEmails, adminEmail, RSOName, userEmail){
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
        queryString = 'Insert into [dbo].[RSO_Create_Requests] values(\'' + RSOName + '\',  \'' + adminEmail + '\', \'' + userEmail + '\', ';

        for (var i = 0; i < allEmails.length; i++){
            queryString = queryString.concat('\'' + allEmails[i] + '\'');
            if (i < allEmails.length - 1)
                queryString = queryString.concat(', ');
        }
        queryString = queryString.concat(')');

        xhttp.send('queryString=' + queryString);
    });
}

async function checkSubmit(inputEID){
    allEmails = [];
    for (var i = 1; i < 5; i++)
        allEmails.push(document.getElementById("email" + i).value);
    adminEmail = document.getElementById("admin_email").value;

    if (!await checkEmailsInSystem(allEmails)){
        alert("One of the emails is not registered in the system");
        return;
    }

    if (!checkAllEmailsSameDomain(allEmails)){
        alert("One or more of the emails have different domains");
        return;
    }

    userData = JSON.parse(userDataString);
    if (allEmails.indexOf(adminEmail) == -1 && userData.recordset[0].Email.trim() != adminEmail.trim()){
        alert("Admin email is not one of the members of this RSO");
        return;
    }

    if (allEmails.indexOf(userData.recordset[0].Email.trim()) > -1){
        alert("Do not put your own email in one of the 4 other student emails");
        return;
    }

    result = makeRequest(allEmails, adminEmail, document.getElementById("RSO_Name").value, userData.recordset[0].Email);
    alert("Request Successfully Sent");
    submitform('Home', userAccessString, userDataString);
}