function addUser(userName, password, email, phone, UID){
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
        queryString = 'Insert into [dbo].[User] values(' + UID + ', \'' + password + '\',  \'' + userName + '\', \'' + email + '\', \'' + phone + '\', \'User\')';

        xhttp.send('queryString=' + queryString);
    });
}

function addUniversityAffiliation(UID, UNIID){
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
        queryString = 'Insert into [dbo].[University_Affiliation] values(' + UID + ', ' + UNIID + ')';
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

async function checkSubmit(){

    /*time = "11:30"
    time = time.split(":");
    console.log("hour: " + time[0]);
    console.log("minute: " + time[1]);*/
    userName = document.getElementById("name").value;
    password = document.getElementById("password").value;
    email = document.getElementById("email").value;
    phone = document.getElementById("phone").value;

    newID = await getNewID("UID", "User");

    result = await addUser(userName, password, email, phone, newID);
    result = await addUniversityAffiliation(newID, document.getElementById("university").options[document.getElementById("university").selectedIndex].value);
    alert("Account successfully created. Your UID is " + newID);

    form = document.getElementById("form");
    form.setAttribute("action", "/");
    form.setAttribute("method", "post");
    form.submit();
    
}