import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import { IUserInfo } from '../login-page/userinfo';
const win: any = window;

@Injectable()
export class SqlStorageService {
    public db: SQLite;

    constructor() {

    }


    getAll() {
        return this.db.executeSql('SELECT key, value FROM kv', []).then(data => {
            let results = [];
            for (let i = 0; i < data.rows.length; i++) {
                results.push(JSON.parse(data.rows.item(i).value));
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
        if(this.db) { 
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
                console.log("INSERTED: " + JSON.stringify(data));
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
        }
    }

    initializeDatabase() {
        this.db = new SQLite();
        if (this.db) {
            this.db.openDatabase({ name: 'fittingo.db', location: 'default' }).then(() => {
                this.CreateUserTable();
            });
        }
    }


    resetDatabase() {
        this.db.executeSql(`DROP TABLE IF EXISTS User`, {}).then(() => {
            console.log('User DROP TABLE SUCCESS');
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
}