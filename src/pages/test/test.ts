import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SQLite } from "ionic-native";

@Component({
    templateUrl: 'test.html'
})
export class Home {

    message: string;
    public database: SQLite;
    public people: Array<Object>;

    constructor(private navController: NavController, private platform: Platform) {
        platform.ready().then(() => {
        this.database = new SQLite();
        this.database.openDatabase({ name: "data.db", location: "default" }).then(() => {
            this.refresh();
        }, (error) => {
            this.message ="1" + error ;
        });
    });
    }

    public add() {
        this.database.executeSql("INSERT INTO people (firstname, lastname) VALUES ('Nic', 'Raboy')", []).then((data) => {
            this.message = "3INSERTED: " + JSON.stringify(data);
        }, (error) => {
            this.message = "4ERROR: " + JSON.stringify(error.err);
        });
    }

    public refresh() {
    
        this.database.executeSql("SELECT * FROM people", []).then((data) => {
            this.people = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    this.people.push({ firstname: data.rows.item(i).firstname, lastname: data.rows.item(i).lastname });
                }
            }
        }, (error) => {
            this.message = "2ERROR: " + JSON.stringify(error);
        }); 
    }

}