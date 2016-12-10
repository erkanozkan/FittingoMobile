import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { IUserInfo } from '../login-page/userinfo';
import { FoodInfo } from '../food-list/foodInfo';

const win: any = window;

@Injectable()
export class SqlStorageService {
    public db: SQLite;
    public isFoodListInserting: boolean = false;
    constructor() {

    }


    getAllFoodList() {
        return this.db.executeSql('SELECT * FROM Food', []).then(data => {
            let results = new Array<FoodInfo>();
            for (let i = 0; i < data.rows.length; i++) {
                results.push(data.rows.item(i) as FoodInfo);
            }
            return results;
        });
    }

    getUser(userName: string, password: string) {
        if (this.db) {
            return this.db.executeSql('select * from User where email = ? and password = ? limit 1', [userName, password]).then((data) => {
                if (data.rows.length > 0) {
                    return data.rows.item(0);
                }
            });
        }
        return Promise.resolve(null);
    }

    // remove(key: string) {
    //     return this.db.executeSql('delete from kv where key = ?', [key]);
    // }

    InsertUser(userInfo: IUserInfo) {
        if (this.db) {
            return this.db.executeSql(`INSERT OR REPLACE into User(
                 userId, email,name,password, Weight,
                 RemainingCalorie,TakenCalorie, CalorieExpenditure,
                 BadgeLevel, GoalWater, DailyWater, DailyCalories) 
                 values (?,?,?,?,?,?,?,?,?,?,?,?)`,
                [userInfo.userId, userInfo.email,
                userInfo.name, userInfo.password, userInfo.Weight,
                userInfo.RemainingCalorie,
                userInfo.TakenCalorie, userInfo.CalorieExpenditure, userInfo.BadgeLevel,
                userInfo.GoalWater, userInfo.DailyWater, userInfo.DailyCalories]).then((data) => {
                    console.log("User Inserted: " + JSON.stringify(data));
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error.err));
                });
        }
    }
    //, callback: (n: boolean) => any
    BulkInsertFoods(rows: Array<FoodInfo>) {
        if (this.db) {
            // console.log(rows.length);
            var q = `INSERT OR REPLACE INTO Food 
                (ProductsId, ProductName,Kalori100Gram,Protein,Fat,
                Carbonhydrate,CategoryId, Type1,
                Type1Gram, Type2, Type2Gram, Type3,
                Type3Gram, UserId, Senkron
                ,CompanyId, BrandId, ProductTypeId) VALUES (?, ?, ?,?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)`;

            var sqlStatemants = [];
            var i = 0;

            for (var row of rows) {

                sqlStatemants.push([q, [row.ProductsId, row.ProductName, row.Kalori100Gram,
                row.Protein, row.Fat, row.Carbonhydrate,
                row.CategoryId, row.Type1, row.Type1Gram,
                row.Type2, row.Type2Gram, row.Type3,
                row.Type3Gram, row.UserId,
                row.Senkron, row.CompanyId, row.BrandId,
                row.ProductTypeId
                ]]);


                // this.db.executeSql(q, [row.ProductsId, row.ProductName, row.Kalori100Gram,
                // row.Protein, row.Fat, row.Carbonhydrate,
                // row.CategoryId, row.Type1, row.Type1Gram,
                // row.Type2, row.Type2Gram, row.Type3,
                // row.Type3Gram, row.UserId,
                // row.Senkron, row.CompanyId, row.BrandId,
                // row.ProductTypeId
                // ]).then(data => {
                //     console.log("Food Inserted: " + JSON.stringify(data));
                // }, (error) => {
                //     console.log("ERROR: " + JSON.stringify(error.err));
                // }); 
            }
            //console.log(sqlStatemants);
            this.db.sqlBatch(sqlStatemants);
        }
    }


    //   getFood(foodName: string) {
    //     if (this.db) {
    //         return this.db.executeSql('select * from Food where ProductName LIKE ? and password = ? limit 40', [foodName]).then((data) => {
    //             if (data.rows.length > 0) {
    //                 return data.rows.item(0);
    //             }
    //         });
    //     }
    //     return Promise.resolve(null);
    // }

    initializeDatabase() {
        this.db = new SQLite();
        if (this.db) {
            this.db.openDatabase({ name: 'fittingo.db', location: 'default' }).then(() => {
                this.resetDatabase();
                this.CreateUserTable();
                this.CreateFoodTable();
            });
        }
    }

    resetDatabase() {
        this.db.executeSql(`DROP TABLE IF EXISTS Food`, {}).then(() => {
            console.log('Food DROP TABLE SUCCESS');
        });
    }

    private CreateUserTable() {
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS User 
            (userId Integer primary key, email text,name text,password text, Weight integer,
                RemainingCalorie integer,TakenCalorie integer, CalorieExpenditure integer,
                BadgeLevel integer, GoalWater integer, DailyWater integer, DailyCalories integer)`, {}).then(() => {
                console.log('User CREATE TABLE SUCCESS');
            });
    }

    private CreateFoodTable() {
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS Food 
            (ProductsId Integer primary key, ProductName text,Kalori100Gram integer,Protein integer, Fat integer,
                Carbonhydrate integer,CategoryId integer, Type1 integer,
                Type1Gram integer, Type2 integer, Type2Gram integer, Type3 integer,
                Type3Gram integer, UserId integer, Senkron integer
                , CompanyId integer, BrandId integer, ProductTypeId integer)`, {}).then(() => {
                console.log('Food CREATE TABLE SUCCESS');
            });
    }
}