exports.query = function (query) {
    return new Promise(function (resolve, reject) {
        const sql = require('mssql/msnodesqlv8');

        const config = {
            server: 'ME-BUILD\\SQLEXPRESS',
            database: "CollegeEventDB",
            options: {
                trustedConnection: true
            }
        };

        sql.connect(config, function (err) {
            if (err) reject(err);

            let sqlRequest = new sql.Request();
            let sqlQuery = query;
            sqlRequest.query(sqlQuery, function (err, data) {
                if (err) reject(err);

                //console.log(data);
                //console.table(data.recordset);
                //console.log(data.rowsAffected);
                //console.log(data.recordset[0].Name);
                //console.log("DDDDDDDDDDDDDDDDDDDDDDD")
                
                sql.close();
                resolve(JSON.stringify(data));
            });
        });
    });
}