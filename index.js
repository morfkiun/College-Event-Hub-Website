const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const { nextTick } = require('process');
const SQLquery = require('./scripts/sqlCalls');
const { json } = require('express');

const UserTypes = ['User', 'Admin', 'Super_Admin'];

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs');

// this might mess up file dir: serves static files
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/login', async function (req, res) {
    let UID = req.body.UID;
    let password = req.body.password;
    var userData = undefined;

    let sqlQuery = 'Select * From [dbo].[User] Where UID = ' + UID + ' AND Password = \'' + password.trim() + '\'';
    userData = await SQLquery.query(sqlQuery);
    userData = JSON.parse(userData);

    var userAccess = [false, false, false];
    for (var i = 0; i < UserTypes.length; i++){
        if (UserTypes[i] == userData.recordset[0].User_Type.trim()){
            userAccess[i] = true;
            break;
        }
    }
    
    //console.log(userAccess);
    res.render('Home', {userData: userData, userAccess: userAccess});
});

app.post('/registerNewUser', async function (req, res) {
    res.render('New_User');
});

app.post('/navBar', async function (req, res){
    page = req.body.page;
    if (page == "Logout"){
        res.sendFile(path.join(__dirname + '/login.html'));
    }

    else if (page == "Event_Details"){
        var userAccess = req.body.userAccess;
        userAccess = JSON.parse(userAccess);
        var userData = req.body.userData;
        userData = JSON.parse(userData);
        var EID = req.body.EID;

        //console.log(userData.recordset[0].Name);
        res.render(page, {userData: userData, userAccess: userAccess, EID: EID});
    }

    else{
        var userAccess = req.body.userAccess;
        userAccess = JSON.parse(userAccess);
        var userData = req.body.userData;
        userData = JSON.parse(userData);

        //console.log(userData.recordset[0].Name);
        res.render(page, {userData: userData, userAccess: userAccess});
    }
});

app.post('/searchEvents', async function (req, res){
    var userAccess = req.body.userAccess;
    userAccess = JSON.parse(userAccess);
    var userData = req.body.userData;
    userData = JSON.parse(userData);

    let UNIID = undefined;
    let sqlQuery = 'Select UNIID From [dbo].[University_Affiliation] Where UID = ' + userData.recordset[0].UID;
    UNIID = await SQLquery.query(sqlQuery);
    UNIID = JSON.parse(UNIID);
    if (UNIID.recordset.length > 0){
        UNIID = UNIID.recordset[0].UNIID;
        sqlQuery = 'Select * From [dbo].[Events] Where Host_University = ' + UNIID + ' AND Event_Type = \'Private\'';
        PrivateEvents = await SQLquery.query(sqlQuery);
        PrivateEvents = JSON.parse(PrivateEvents);

        sqlQuery = 'Select * From [dbo].[Events] Where Event_Type = \'Public\'';
        PublicEvents = await SQLquery.query(sqlQuery);
        PublicEvents = JSON.parse(PublicEvents);

        //console.log(PrivateEvents, PublicEvents);
        sqlQuery = 'Select * From [dbo].[RSO_Memberships] Where UID = ' + userData.recordset[0].UID;
        RSOMembershipData = await SQLquery.query(sqlQuery);
        RSOMembershipData = JSON.parse(RSOMembershipData);
        //console.log(RSOMembershipData);
        sqlQuery = 'Select * From [dbo].[Events] Where Host_University = ' + UNIID + ' AND Event_Type = \'RSO\'';
        if (RSOMembershipData.recordset.length > 0)
            sqlQuery = sqlQuery.concat(' AND (');
        for (var i = 0; i < RSOMembershipData.recordset.length; i++){
            sqlQuery = sqlQuery.concat(' Host_RSO = ' + RSOMembershipData.recordset[i].RSOID);
            if (i < RSOMembershipData.recordset.length - 1)
                sqlQuery = sqlQuery.concat(' OR ');
            if (i == RSOMembershipData.recordset.length - 1)
                sqlQuery = sqlQuery.concat(')');
        }

        // if person has no RSO memberships, this query returns empty
        if (RSOMembershipData.recordset.length == 0)
            sqlQuery = sqlQuery.concat( ' AND EID = 0');
        
        //console.log(sqlQuery);
        RSOEvents = await SQLquery.query(sqlQuery);
        RSOEvents = JSON.parse(RSOEvents);
        //console.log(RSOEvents);

        // get location and university ids of events
        eventData = {PublicEvents: PublicEvents, PrivateEvents: PrivateEvents, RSOEvents: RSOEvents};
        var eventStrings = ["PublicEvents", "PrivateEvents", "RSOEvents"];
        allLIDs = [];
        allUNIIDs = [];
        for (var z = 0; z < eventStrings.length; z++){
            for (var i = 0; i < eventData[eventStrings[z]].recordset.length; i++){
                // add unique ids
                if (allLIDs.indexOf(eventData[eventStrings[z]].recordset[i].LID) == -1)
                    allLIDs.push(eventData[eventStrings[z]].recordset[i].LID);
                if (allUNIIDs.indexOf(eventData[eventStrings[z]].recordset[i].Host_University) == -1)
                    allUNIIDs.push(eventData[eventStrings[z]].recordset[i].Host_University);
            }
        }

        // get locations and universities
        sqlQuery = 'Select * From [dbo].[Location]';
        if (allLIDs.length > 0)
            sqlQuery = sqlQuery.concat(' Where ');
        for (var i = 0; i < allLIDs.length; i++){
            sqlQuery = sqlQuery.concat(' LID = ' + allLIDs[i]);
            if (i < allLIDs.length - 1)
                sqlQuery = sqlQuery.concat(' OR ');
        }

         // if person has no eligible events, this query returns empty
         if (allLIDs.length == 0)
            sqlQuery = sqlQuery.concat( ' Where LID = 0');

        Locations = await SQLquery.query(sqlQuery);
        Locations = JSON.parse(Locations); 

        sqlQuery = 'Select * From [dbo].[University]';
        if (allUNIIDs.length > 0)
            sqlQuery = sqlQuery.concat(' Where ');
        for (var i = 0; i < allUNIIDs.length; i++){
            sqlQuery = sqlQuery.concat(' UNIID = ' + allUNIIDs[i]);
            if (i < allUNIIDs.length - 1)
                sqlQuery = sqlQuery.concat(' OR ');
        }

        // if person has no eligible events, this query returns empty
        if (allUNIIDs.length == 0)
            sqlQuery = sqlQuery.concat( ' Where UNIID = 0');

        Universities = await SQLquery.query(sqlQuery);
        Universities = JSON.parse(Universities); 

        data = {PublicEvents: PublicEvents, PrivateEvents: PrivateEvents, RSOEvents: RSOEvents, UNIID: UNIID, Locations: Locations, Universities: Universities};
        //console.log(data);
        res.send(JSON.stringify(data));
    }
});

app.post('/query', async function (req, res){
    var queryString = req.body.queryString;
    queryResult = await SQLquery.query(queryString);
    res.send(queryResult);
});

const webserver = app.listen(5000, function () {

    console.log('Server is running');
});