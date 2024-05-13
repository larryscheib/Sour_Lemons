//import { openDatabase, deleteDatabase } from 'react-native-sqlite-storage';

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'sqlite.db', location: 'default' },
  () => { },
  error => { console.error('Error opening database:', error); }
);

//import * as ApxSQLite from "./assets/www/sqlite.db";

/*db = openDatabase(
    { name: './assets/www/sqlite.db', createFromLocation: "default" },
    () => {
        console.log('Connection success!');
    },
    error => {
        console.log(error);
    },
);
*/
/// Below function is use in-case the db object is null
/*async function OpenDatabase() {
        console.log("openDatabase from sqlite-db.js");
    var db = openDatabase(
        { name: 'sqlite.db', createFromLocation: "default" },
        () => {
            console.log('Re-open connection success!');
        },
        error => {
            console.log(error);
        },
    );
}
*/

function SQLSelect(query, params = []) {
  console.log("into SQLSelect ")
  console.log(query);
  console.log("params "+  params);
    return new Promise(async (resolve, reject) => {
      //  console.log("db = "+db);

        db.transaction(function (txn) {

            console.log('SQLITE SELECT QUERY:', query, ',Value:', params);
            txn.executeSql(query, params,
                function (tx, res) {
                    var temp = [];
                    if (res.rows.length == 0) {
                        resolve(temp);
                    }
                    for (let i = 0; i < res.rows.length; ++i) temp.push(res.rows.item(i));
                    console.log('SQLITE SELECT RESULT:', temp)
                    resolve(temp);
                },
                function (error) {
                    console.log('Failed to select:', error);
                    reject();
                },
            );
        });
    });
}
function SQLInsert(query, params = []) {
   console.log("made it into sqlite-db.js SQLInsert");
    return new Promise(async (resolve, reject) => {

        db.transaction(function (txn) {
            console.log('SQLITE INSERT QUERY:', query, ',Value:', params);
            txn.executeSql(query, params,
                function (tx, res) {
                    console.log('SQLITE INSERT RESULT:', res)
                    resolve(res);
                },
                function (error) {
                    console.log('Failed to insert:', error);
                    reject();
                },
            );
        });
    });
}
function SQLUpdate(query, params = []) {
    return new Promise(async (resolve, reject) => {
        if (db === null) {
            await OpenDatabase();
        }
        await db.transaction(function (txn) {
            console.log('SQLITE UPDATE QUERY:', query, ',Value:', params);
            txn.executeSql(query, params,
                function (tx, res) {
                    console.log('SQLITE UPDATE RESULT:', res);
                    if (res.rowsAffected > 0) {
                        // Data updated
                        resolve(res.rowsAffected);
                    } else {
                        // Data not updated
                        resolve(0);
                    }
                },
                function (error) {
                    console.log('Failed to update:', error);
                    reject();
                },
            );
        });
    });
}
function SQLDelete(query, params = []) {
    return new Promise(async (resolve, reject) => {
        if (db === null) {
            await OpenDatabase();
        }
        await db.transaction(function (txn) {
            console.log('SQLITE DELETE QUERY:', query, ',Value:', params);
            txn.executeSql(query, params,
                function (tx, res) {
                    console.log('SQLITE DELETE RESULT:', res)
                    if (res.rowsAffected > 0) {
                        // Data deleted
                        resolve(res.rowsAffected);
                    } else {
                        // Data not delete
                        reject();
                    }
                },
                function (error) {
                    console.log('Failed to delete:', error);
                    reject();
                },
            );
        });
    });
}

async function GetMeSomethingOnDB(data) {
    return new Promise(async (resolve, reject) => {
        try {
            var SQData = {
                "TABLERESULT": []
            }
            let params = [];
            let queries = '';
            params = [data.TableID];
            queries = `SELECT * FROM [TABLE] WHERE TableID=?`;
            await SQLSelect(queries, params).then(results => SQData.TABLERESULT = results).catch((error) => console.log('Error retrieve TABLERESULT. ', error));
            resolve(SQData);
        } catch (error) {
            console.log('ERROR GET SOMETHING:', error);
            reject();
        }
    });
}

export {
SQLSelect,
SQLInsert,
GetMeSomethingOnDB,
};