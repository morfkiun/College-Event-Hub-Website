function fillSelect(tableName, selectNameAttribute, selectValueAttribute){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        insertSelectOptions("", data.recordset, selectNameAttribute, selectValueAttribute);
    }
    };
    xhttp.open("POST", "/query", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    queryString = 'Select * From [dbo].[' + tableName + ']';
    xhttp.send('queryString=' + queryString);
}

function insertSelectOptions(defaultString, list, selectNameAttribute, selectValueAttribute){
    var selectList = document.getElementById('select');

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
    form = document.getElementById("university_profile_form");
    var selectList = document.getElementById('select');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        alert("University Profile Successfully Created");
        submitform('Home', userAccessString, userDataString);
    }
    };
    xhttp.open("POST", "/query", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    description = document.getElementById("description").value;
    universityName = document.getElementById("university_name").value;
    newID = await getNewID("UNIID", "University");
    LID = selectList.options[selectList.selectedIndex].value;
    queryString = 'Insert into [dbo].[University] values(\'' + description + '\', \'' + universityName + '\', ' + newID + ', ' + LID + ')';
    xhttp.send('queryString=' + queryString);
}

function getNewID(IDname, tableName){
    return new Promise(function(resolve, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            //console.log("result: " + parseInt(data.recordset[0][""]) + 1);
            resolve(parseInt(data.recordset[0][""]) + 1);
        }
        };
        xhttp.open("POST", "/query", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        queryString = 'Select Max(' + IDname + ') from [dbo].[' + tableName +']';
        xhttp.send('queryString=' + queryString);
    });
}