import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { IUserInfo } from '../login-page/userinfo';
import { FoodInfo } from '../food-list/foodInfo';
import { ServingTypeInfo } from '../food-detail/serve-type-info';
import { SportInfo } from '../sport-list/sportInfo';
import { ActivityInfo } from '../food-list/activityInfo';
import { EventModel, EventDate } from '../activity-list/ActivityModel';

import { Network } from 'ionic-native';

import { FoodService, SportService, ProductType } from '../shared/shared';
//import { Http, Response, RequestOptions, Headers } from '@angular/http'

const win: any = window;

@Injectable()
export class SqlStorageService {
    public db: SQLite;
    public isFoodListInserting: boolean = false;
    monthNames = ["Oca", "Şub", "Mart", "Nis", "May", "Haz",
        "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"
    ];
    constructor(private foodService: FoodService,
        private sportService: SportService) {
        //  foodService = new FoodService();
    }


    getAllFoodList() {
        if (this.db) {
            return this.db.executeSql('SELECT * FROM Food', []).then(data => {
                let results = new Array<FoodInfo>();
                for (let i = 0; i < data.rows.length; i++) {
                    results.push(data.rows.item(i) as FoodInfo);
                }
                return results;
            });
        } else {
            return Promise.resolve(null);
        }
    }

    getAllExerciseList() {
        if (this.db) {
            return this.db.executeSql('SELECT * FROM Exercise', []).then(data => {
                let results = new Array<SportInfo>();
                for (let i = 0; i < data.rows.length; i++) {
                    results.push(data.rows.item(i) as SportInfo);
                }
                return results;
            });
        } else {
            return Promise.resolve(null);
        }
    }
    parseDate(input) {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]); // months are 0-based
    }
    getAllActivityListToday(userId: number) {
        if (this.db) {
            var date = new Date().toISOString().substring(0, 10);

            return this.db.executeSql('SELECT ActivityDateTime,ActivityDescription,Calorie FROM Activity where date(ActivityDateTime)=?  and UserId=?', [date, userId]).then(data => {
                let results = new Array<EventModel>();
                for (let i = 0; i < data.rows.length; i++) {
                    var eventModel = data.rows.item(i) as EventModel;
                    var eventDate = new EventDate();

                    var date = this.parseDate(data.rows.item(i).ActivityDateTime);

                    eventDate.day = date.getDate();

                    eventDate.month = date.getMonth();
                    eventDate.time = date.getHours().toString() + ":" + date.getMinutes().toString();
                    eventDate.full = date.toLocaleString();
                    eventDate.month_name = this.monthNames[date.getMonth()]

                    eventModel.ActivityDateTime = eventDate;

                    eventModel.ActivityDescription = data.rows.item(i).ActivityDescription;
                    eventModel.Calorie = data.rows.item(i).Calorie;
                    console.log("calorie: " + data.rows.item(i).Calorie);

                    results.push(eventModel);
                }
                return results;
            });
        } else {
            return Promise.resolve(null);
        }
    }


    getAllActivityThisWeekly(userId: number) {
        if (this.db) {
            var startdate = new Date().toISOString().substring(0, 10);
            var dateFormated = new Date();
            dateFormated.setDate(dateFormated.getDate() - 7);
            var endDate = dateFormated.toISOString().substr(0, 10);

            return this.db.executeSql('SELECT ActivityDateTime,ActivityDescription,Calorie FROM Activity where date(ActivityDateTime)<=? and date(ActivityDateTime)>=?  and UserId=?', [startdate, endDate, userId]).then(data => {
                let results = new Array<EventModel>();
                for (let i = 0; i < data.rows.length; i++) {
                    var eventModel = data.rows.item(i) as EventModel;
                    var eventDate = new EventDate();

                    var date = this.parseDate(data.rows.item(i).ActivityDateTime);

                    eventDate.day = date.getDate();
                    eventDate.month = date.getMonth();
                    eventDate.time = date.getHours().toString() + ":" + date.getMinutes().toString();
                    eventDate.full = date.toLocaleString();

                    eventModel.ActivityDateTime = eventDate;

                    eventModel.ActivityDescription = data.rows.item(i).ActivityDescription;
                    eventModel.Calorie = data.rows.item(i).Calorie;

                    console.log("calorie: " + data.rows.item(i).Calorie);
                    results.push(eventModel);
                }
                return results;
            });
        } else {
            return Promise.resolve(null);
        }
    }


    SyncedActivitiesWithApi() {
        if (this.db) {
            return this.db.executeSql('SELECT * FROM Activity where IsSynced=0', []).then(data => {
                for (let i = 0; i < data.rows.length; i++) {
                    var activityInfo = data.rows.item(i) as ActivityInfo;
                    if (activityInfo.ProductType == ProductType.Food) {
                        this.foodService.AddFoodActivity(activityInfo).subscribe(activityId => {
                            if (activityId != 0) {
                                this.UpdateActivityAsSynced(activityInfo.ActivityId, activityId);
                            }
                        });
                    } else if (activityInfo.ProductType == ProductType.Exercise) {
                        this.sportService.AddSportActivity(activityInfo).subscribe(activityId => {
                            if (activityId != 0) {
                                this.UpdateActivityAsSynced(activityInfo.ActivityId, activityId);
                            }
                        });
                    }
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    getAllServingTypeList() {
        if (this.db) {
            return this.db.executeSql('SELECT * FROM ServingType', []).then(data => {
                let results = new Array<ServingTypeInfo>();
                for (let i = 0; i < data.rows.length; i++) {
                    results.push(data.rows.item(i) as ServingTypeInfo);
                }
                return results;
            });
        } else {
            return Promise.resolve(null);
        }
    }

    InsertServiceTypeList(serviceTypeId: number) {
        this.foodService.GetServiceTypeList(serviceTypeId)
            .subscribe(data => {
                this.BulkInsertServingTypes(data);
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
                 BadgeLevel, GoalWater, DailyWater, DailyCalories,
                 WeeklyGoal,UserImageURL,GoalWeight,GenderId,
              ExerciseIntensityId,Height,GoalPlanId,BirthYear,IsUserSynced) 
                 values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [userInfo.userId, userInfo.email,
                userInfo.name, userInfo.password, userInfo.Weight,
                userInfo.RemainingCalorie,
                userInfo.TakenCalorie, userInfo.CalorieExpenditure, userInfo.BadgeLevel,
                userInfo.GoalWater, userInfo.DailyWater,
                userInfo.DailyCalories,
                userInfo.WeeklyGoal, userInfo.UserImageURL, userInfo.GoalWeight, userInfo.GenderId,
                userInfo.ExerciseIntensityId, userInfo.Height, userInfo.GoalPlanId,
                userInfo.BirthYear, userInfo.IsUserSynced]).then((data) => {
                    console.log("User Inserted: " + JSON.stringify(data));
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error.err));
                });
        } else {
            return Promise.resolve(null);
        }
    }

    UpdateActivityAsSynced(activityId: string, newActivityId: number) {
        if (this.db) {
            return this.db.executeSql(`UPDATE Activity SET IsSynced=1,ActivityId=?  where ActivityId=?`, [newActivityId, activityId]).then((data) => {
                console.log("Activity Updated: " + JSON.stringify(data));
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
        } else {
            return Promise.resolve(null);
        }
    };

    InsertActivity(activityInfo: ActivityInfo) {
        if (this.db) {
            return this.db.executeSql(`INSERT into Activity(ActivityId,
                 ActivityDateTime, Amount,Calorie,ActivityName, ActivityDescription,
                 ExerciseId,UserId, ServingTypeId,
                 ActivityTypeId, UserActivityId, MealId,IsSynced,ProductType) 
                 values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [activityInfo.ActivityId, activityInfo.ActivityDateTime, activityInfo.Amount,
                activityInfo.Calorie, activityInfo.ActivityName, activityInfo.ActivityDescription,
                activityInfo.ExerciseId, activityInfo.UserId, activityInfo.ServingTypeId,
                activityInfo.ActivityTypeId, activityInfo.UserActivityId
                    , activityInfo.MealId, activityInfo.IsSynced, activityInfo.ProductType]).then((data) => {
                        console.log("Activity Inserted: " + JSON.stringify(data));

                        this.UpdateUser(activityInfo.Calorie, activityInfo.UserId, activityInfo.ProductType);

                    }, (error) => {
                        console.log("ERROR: " + JSON.stringify(error.err));
                    });
        } else {
            //bu kısım bir kere olsun ve ana sayfaya geldiğinde olsun,
            if (Network.connection != "none") { //eğer internet varsa sunucuya göndermeyi dene.
                if (activityInfo.ProductType == ProductType.Food) {
                    this.SyncFoodApiCall(activityInfo);
                } else if (activityInfo.ProductType == ProductType.Exercise) {
                    this.SyncExerciseApiCall(activityInfo);
                }
            }
            return Promise.resolve(null);
        }
    }

    SyncExerciseApiCall(activityInfo: ActivityInfo) {

        this.sportService.AddSportActivity(activityInfo).
            subscribe(activityId => {
                if (activityId != 0 && this.db) {
                    this.UpdateActivityAsSynced(activityInfo.ActivityId, activityId);
                }
            });

    }

    SyncFoodApiCall(activityInfo: ActivityInfo) {

        this.foodService.AddFoodActivity(activityInfo).
            subscribe(activityId => {
                if (activityId != 0 && this.db) {
                    this.UpdateActivityAsSynced(activityInfo.ActivityId, activityId);
                }
            });

    }

    UpdateUserWaterCount(count: number, userId: number) {
        if (this.db) {
            var q = `update User set DailyWater = ? where userId = ?`;
            return this.db.executeSql(q,
                [count, userId]).then((data) => {
                    console.log("user water update edildi.");
                    return true;
                }, (error) => {
                    console.log("update User ERROR: " + JSON.stringify(error.err));
                    return false;
                });
        } else {
            return Promise.resolve(null);
        }
    }

    UpdateUser(calorie: number, userId: number, producType: ProductType) {
        if (this.db) {
            if (producType == ProductType.Food) {
                var q = `update User set 
                        TakenCalorie = (TakenCalorie + ?),RemainingCalorie=(RemainingCalorie - ?) where userId = ?`;
            } else {
                var q = `update User set CalorieExpenditure=(CalorieExpenditure + ?), RemainingCalorie=(RemainingCalorie + ?) where userId = ?`;
            }

            this.db.executeSql(q,
                [calorie, calorie, userId]).then((data) => {
                    console.log("user calorie update edildi.");
                }, (error) => {
                    console.log("update User ERROR: " + JSON.stringify(error.err));
                });
        } else {
            return Promise.resolve(null);
        }
    }

    //, callback: (n: boolean) => any
    BulkInsertFoods(rows: Array<FoodInfo>) {
        if (this.db) {
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
        } else {
            return Promise.resolve(null);
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
                sqlStatemants.push([q, [activityInfo.ActivityId, new Date().toISOString(), activityInfo.Amount,
                activityInfo.Calorie, activityInfo.ActivityName, activityInfo.ActivityDescription,
                activityInfo.ExerciseId, activityInfo.UserId, activityInfo.ServingTypeId,
                activityInfo.ActivityTypeId, activityInfo.UserActivityId
                    , activityInfo.MealId, 1, activityInfo.ProductType]]);
            }
            this.db.sqlBatch(sqlStatemants);
        } else {
            return Promise.resolve(null);
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
        } else {
            return Promise.resolve(null);
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
        } else {
            return Promise.resolve(null);
        }
    }

    initializeDatabase() {
        this.db = new SQLite();
        if (this.db) {
            this.db.openDatabase({ name: 'fittingo.db', location: 'default' }).then(() => {
                //this.resetDatabase();
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
                BadgeLevel integer, GoalWater integer, DailyWater integer, 
                DailyCalories integer,WeeklyGoal integer,UserImageURL text,GoalWeight integer,
                GenderId integer,ExerciseIntensityId integer,Height integer,
                GoalPlanId integer,
                BirthYear integer,IsUserSynced integer)`, {}).then(() => {
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
                this.InsertServiceTypeList(0);
            });
    }

    private CreateExerciseTable() {
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS Exercise 
            (ExerciseId Integer primary key,ExerciseName text
            ,Level1 number,Level2 number,Level3 number)`, {}).then(() => {
                console.log('Exercise CREATE TABLE SUCCESS');
            });
    }

    private CreateActivityTable() {
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS Activity 
            (ActivityId text primary key,ActivityDateTime DATETIME
            ,Amount number,Calorie number,ActivityName text
            ,ActivityDescription text,ExerciseId number,UserId number
            ,ServingTypeId number,ActivityTypeId number,UserActivityId number
             ,MealId number,IsSynced boolean,ProductType  number)`, {}).then(() => {
                console.log('Exercise Activity TABLE SUCCESS');
            });
    }
}