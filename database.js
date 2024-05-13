import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon.db");

const selectAllMenu = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        tx.executeSql(
          `
              CREATE TABLE IF NOT EXISTS menu (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  price NUMERIC NOT NULL,
                  description TEXT NOT NULL,
                  image TEXT NOT NULL,
                  category TEXT NOT NULL
                  );
                  `
        );

        tx.executeSql("select * from menu", [], (_, { rows }) => {
          const menu = rows._array;
          resolve(menu);
        });
      } catch (error) {
        console.error("ERROR GETTING MENU", error);
        reject(error);
      }
    });
  });
};


const getDataFromApiAsync = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
    );
    const json = await response.json();
    return json.menu;
  } catch (error) {
    console.error(error);
  }
};

const insertDish = (dishName, description, price, photoUri, category) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
      console.log("insert dish ");
        tx.executeSql(
          "insert into menu (name,price,description,image,category) values (?,?,?,?,?)",
          [dishName, price, description, photoUri, category]
        );
      },
      reject,
      resolve
    );
  });
};

const resetDatabase = () => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql("DROP TABLE IF EXISTS menu");
        },
        reject,
        resolve
      );
    } catch (error) {
      console.error("Error Reseting database", error);
      reject(error);
    }
  });
};

const checkMenuTableAndPopulateData = async () => {
  const dbMenu = await selectAllMenu();
  if (dbMenu?.length) return dbMenu;
  const menuItemsFromApi = await getDataFromApiAsync();

  const formattedItemsFromApi = menuItemsFromApi.map((item) => ({
    ...item,
    image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
  }));
  for (const item of formattedItemsFromApi) {
    await insertDish(
      item.name,
      item.description,
      item.price,
      item.image,
      item.category
    );
  }
  const menuItems = await selectAllMenu();
  return menuItems;
};

const filterMenuItems = (categories, searchInput) => {
  return new Promise((resolve, reject) => {
    try {
      const queryArray = [];
      if (searchInput.length) {
        queryArray.push(`LOWER(name) LIKE '%${searchInput.toLowerCase()}%'`);
      }
      if (categories.length) {
        for (const catagory of categories) {
          queryArray.push(`category='${catagory.toLowerCase()}'`);
        }
      }
      const queryString = queryArray.length
        ? "where " + queryArray.join(" AND ")
        : "";
      const finalQuery = `select * from menu ${queryString};`;
      db.transaction(
        (tx) => {
          tx.executeSql(finalQuery, [], (_, { rows }) => {
            const menu = rows._array;
            resolve(menu);
          });
        },
        (e) => console.error("ERROR FILTERING", e)
      );
    } catch (error) {
      console.error("Error filtering menu items", error);
      reject(error);
    }
  });
};

function createTable () {
      return new Promise((resolve, reject) => {
      console.log("in createTable")
        db.transaction((tx) => {
          try {
           tx.executeSql('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email VARCHAR(16) NOT NULL UNIQUE, phoneNumber VARCHAR(16) not null, firstName VARCHAR(16), lastName VARCHAR(16))');
           } catch (error) {
            console.error("ERROR CREATING user TABLE", error);
            reject(error);
          }
        });
      });
    };

 const checkForUser = async (email) => {
  try {

         if(email != null)
          {
          const ct = createTable();
          const usrExist = checkDBUserExist(email);
          return usrExist;
              }
           else
              return 0;
     } catch (err) {
       console.error(`There was an error inserting user: ${err}`);
     }

   };

 function checkDBUserExist(email) {
       const ct = createTable();
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql("select count(*) as cnt from user where email = ?",
              [email],
              async (tx, results) => {
                   var len = JSON.stringify(results.rows._array[0].cnt);
                   var a = 0;
                      if (len > 0)
                        a = 1;//There will be an async function for setting like that
                       else
                        a = 0;
                     return resolve(a)
             });
          });
        });
   }

const insertUser = (firstName, lastName, email, phoneNumber) => {

 return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        tx.executeSql(
          "insert into user (firstName,lastName,email,phoneNumber) values (?,?,?,?)",
          [firstName, lastName, email, phoneNumber]
           );
          } catch (error) {
            console.error("ERROR INSERTING USER", error);
            reject(error);
          }
        });
      });
}

const updateUserInDB = (firstName, lastName, phoneNumber, email) => {
 return new Promise((resolve, reject) => {
    db.transaction((tx) => {
        try {
            console.log("tx.executeSql update of user")
             tx.executeSql(
                "UPDATE user set firstName=?, lastName=?,  phoneNumber=? where email=?",
                [firstName, lastName, phoneNumber, email]
            );
             } catch (error) {
               console.error("ERROR UPDATING USER", error);
               reject(error);
             }
        });
    });
  };

  const deleteUser = (email) => {

   return new Promise((resolve, reject) => {
      db.transaction((tx) => {
          try {
               tx.executeSql(
                  "DELETE FROM user where email=?",
                  [email]
              );
               } catch (error) {
                 console.error("ERROR DELETING USER", error);
                 reject(error);
               }
          });
      });
    };

const getPhoneNumber = (email)  => {
 let phone;
 return new Promise((resolve, reject) => {
     db.transaction((tx) => {
         tx.executeSql("select phoneNumber from user where email = ?",
           [email],
            async (tx, results) => {
                 var len = results.rows.length;
                 console.log("len = "+len);
                   var phone = null;
                   if(len > 0)
                   {
                      phone = results.rows.item(0).phoneNumber;
                   }
                   return resolve(phone);

              });
     });
     });
};

const getUserDetails = (email)  => {
 let phone;
 return new Promise((resolve, reject) => {
     db.transaction((tx) => {
         tx.executeSql("select phoneNumber, lastName from user where email = ?",
           [email],
            async (tx, results) => {
                 var len = results.rows.length;
                 var userDetail=null;
                 let last = null;
                 let phone = null;
                   var userDetail = {phoneNumber:"", lastName:""};
                   if(len > 0)
                   {
                     phone = results.rows.item(0).phoneNumber;
                     last = results.rows.item(0).lastName;
                     userDetail =
                      {
                         phoneNumber:phone,
                         lastName:last
                      }
                   }
                   return resolve(userDetail);

              });
     });
     });
};

export {
  filterMenuItems,
  selectAllMenu,
  insertDish,
  checkMenuTableAndPopulateData,
  getDataFromApiAsync,
  resetDatabase,
  checkForUser,
  checkDBUserExist,
  insertUser,
  updateUserInDB,
  getPhoneNumber,
  getUserDetails,
  deleteUser,
};
