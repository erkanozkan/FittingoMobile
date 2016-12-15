import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { IUserInfo } from '../login-page/userinfo';
import { FoodInfo } from '../food-list/foodInfo';
import { ServingTypeInfo } from '../food-detail/serve-type-info';
import { SportInfo } from '../sport-list/sportInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { Network } from 'ionic-native';

import { FoodService } from '../shared/shared';
//import { Http, Response, RequestOptions, Headers } from '@angular/http'

const win: any = window;

@Injectable()
export class SqlStorageService {
    public db: SQLite;
    public isFoodListInserting: boolean = false;
    constructor(private foodService: FoodService) {
        //  foodService = new FoodService();
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

    getAllExerciseList() {
        return this.db.executeSql('SELECT * FROM Exercise', []).then(data => {
            let results = new Array<SportInfo>();
            for (let i = 0; i < data.rows.length; i++) {
                results.push(data.rows.item(i) as SportInfo);
            }
            return results;
        });
    }

    getAllActivityListToday() {
        var date = new Date().toISOString().substring(0, 10);

        return this.db.executeSql('SELECT * FROM Activity where date(ActivityDatetime)=? ', [date]).then(data => {
            let results = new Array<ActivityInfo>();
            for (let i = 0; i < data.rows.length; i++) {
                results.push(data.rows.item(i) as ActivityInfo);
            }
            return results;
        });
    }

    getAllServingTypeList() {
        return this.db.executeSql('SELECT * FROM ServingType', []).then(data => {
            let results = new Array<ServingTypeInfo>();
            for (let i = 0; i < data.rows.length; i++) {
                results.push(data.rows.item(i) as ServingTypeInfo);
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
        console.log(userInfo.TakenCalorie);
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

    UpdateActivityAsSynced(activityId: string, newActivityId: number) {
        if (this.db) {
            return this.db.executeSql(`UPDATE Activity SET IsSynced=1,ActivityId=?  where ActivityId=?`, [newActivityId, activityId]).then((data) => {
                console.log("Activity Updated: " + JSON.stringify(data));
            
            }, (error) => {
                console.log(error);
                console.log("ERROR: " + JSON.stringify(error.err));
            });
        }
    };

    InsertActivity(activityInfo: ActivityInfo) {
        if (this.db) {
            return this.db.executeSql(`INSERT into Activity(ActivityId,
                 ActivityDateTime, Amount,Calorie,ActivityName, ActivityDescription,
                 ExerciseId,UserId, ServingTypeId,
                 ActivityTypeId, UserActivityId, MealId,IsSynced,ProductType) 
                 values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [activityInfo.ActivityId, activityInfo.activiyDate, activityInfo.amount,
                activityInfo.calorie, activityInfo.ActivityName, activityInfo.ActivityDescription,
                activityInfo.ExerciseId, activityInfo.userId, activityInfo.servingTypeId,
                activityInfo.ActivityTypeId, activityInfo.UserActivityId
                    , activityInfo.mealType, activityInfo.IsSynced, activityInfo.ProductType]).then((data) => {
                        console.log("Activity Inserted: " + JSON.stringify(data));

                        var insertId = activityInfo.ActivityId;

                        this.db.executeSql(`update User set 
                        TakenCalorie = (TakenCalorie + ?),RemainingCalorie=(RemainingCalorie - ?) where userId = ?`,
                            [activityInfo.calorie, activityInfo.calorie, activityInfo.userId]).then((data) => {
                                console.log("user calorie update edildi.");
                            }, (error) => {
                                console.log("update User ERROR: " + JSON.stringify(error.err));
                            });

                        if (Network.connection != "none") { //eğer internet varsa sunucuya göndermeyi dene.
                            this.foodService.AddFoodActivity(activityInfo).
                                subscribe(activityId => {
                                    console.log(activityId);
                                    console.log(insertId);

                                    if (activityId != 0) {
                                        activityInfo.IsSynced = 1;

                                        this.UpdateActivityAsSynced(insertId, activityId);
                                    }
                                });
                        }
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
            for (var row of rows) {
                sqlStatemants.push([q, [row.ProductsId, row.ProductName, row.Kalori100Gram,
                row.Protein, row.Fat, row.Carbonhydrate,
                row.CategoryId, row.Type1, row.Type1Gram,
                row.Type2, row.Type2Gram, row.Type3,
                row.Type3Gram, row.UserId,
                row.Senkron, row.CompanyId, row.BrandId,
                row.ProductTypeId
                ]]);
            }
            this.db.sqlBatch(sqlStatemants);
        }
    }

    //web üzerinden yapılan değişikliklerin çekilmesi için
    InsertoReplaceActivities(rows: Array<ActivityInfo>) {
        if (this.db) {
            var q = `INSERT OR REPLACE into Activity(ActivityId,
                 ActivityDateTime, Amount,Calorie,ActivityName, ActivityDescription,
                 ExerciseId,UserId, ServingTypeId,
                 ActivityTypeId, UserActivityId, MealId,IsSynced,ProductType) 
                 values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            var sqlStatemants = [];
            for (var activityInfo of rows) {
                sqlStatemants.push([q, [activityInfo.ActivityId, new Date().toISOString(), activityInfo.amount,
                activityInfo.calorie, activityInfo.ActivityName, activityInfo.ActivityDescription,
                activityInfo.ExerciseId, activityInfo.userId, activityInfo.servingTypeId,
                activityInfo.ActivityTypeId, activityInfo.UserActivityId
                    , activityInfo.mealType, 1, activityInfo.ProductType]]);
            }
            this.db.sqlBatch(sqlStatemants);
        }
    }

    BulkInsertServingTypes(rows: Array<ServingTypeInfo>) {
        if (this.db) {
            var q = `INSERT OR REPLACE INTO ServingType 
                (ServingTypeId, ServingTypeName) VALUES (?, ?)`;

            var sqlStatemants = [];
            for (var row of rows) {
                sqlStatemants.push([q, [row.ServingTypeId, row.ServingTypeName]]);
            }
            this.db.sqlBatch(sqlStatemants);
        }
    }

    BulkInsertExercises(rows: Array<SportInfo>) {
        if (this.db) {
            var q = `INSERT OR REPLACE INTO Exercise 
                (ExerciseId, ExerciseName,Level1,Level2,Level3) 
                VALUES (?, ?, ?,?, ?)`;

            var sqlStatemants = [];

            for (var row of rows) {
                sqlStatemants.push([q, [row.ExerciseId, row.ExerciseName, row.Level1,
                row.Level2, row.Level3]]);
            }
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
                this.CreateServingTypeTable();
                this.CreateExerciseTable();
                this.CreateActivityTable();
            });
        }
    }

    resetDatabase() {
        this.db.executeSql(`DROP TABLE IF EXISTS User`, {}).then(() => {
            console.log('User DROP TABLE SUCCESS');
        });

        this.db.executeSql(`DROP TABLE IF EXISTS Activity`, {}).then(() => {
            console.log('Activity DROP TABLE SUCCESS');
        });

        this.db.executeSql(`DROP TABLE IF EXISTS Food`, {}).then(() => {
            console.log('Food DROP TABLE SUCCESS');
        });

        this.db.executeSql(`DROP TABLE IF EXISTS ServingType`, {}).then(() => {
            console.log('ServingType DROP TABLE SUCCESS');
        });
        this.db.executeSql(`DROP TABLE IF EXISTS Exercise`, {}).then(() => {
            console.log('Exercise DROP TABLE SUCCESS');
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

    private CreateServingTypeTable() {
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS ServingType 
            (ServingTypeId Integer primary key, ServingTypeName text)`, {}).then(() => {
                console.log('ServingType CREATE TABLE SUCCESS');
            });
    }

    private CreateExerciseTable() {
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS Exercise 
            (ExerciseId Integer primary key, ExerciseName text
            , Level1 number, Level2 number, Level3 number)`, {}).then(() => {
                console.log('Exercise CREATE TABLE SUCCESS');
            });
    }

    private CreateActivityTable() {
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS Activity 
            (ActivityId text primary key, ActivityDateTime DATETIME
            , Amount number, Calorie number, ActivityName text
            , ActivityDescription text, ExerciseId number, UserId number
            , ServingTypeId number, ActivityTypeId number, UserActivityId number
             , MealId number,IsSynced boolean,ProductType  number)`, {}).then(() => {
                console.log('Exercise Activity TABLE SUCCESS');
            });
    }
}