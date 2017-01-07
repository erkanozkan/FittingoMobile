export class EventModel {
  ActivityDescription: string;
  Calorie: number;
  ActivityDateTime: EventDate;
}

export class ActivityModel {
  today: Array<EventModel> = [];
  week: Array<EventModel> = [];
}

export class EventDate {
  day: number;
  month: number;
  month_name: string;
  time: string;
  full: string;
}
