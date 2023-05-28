export class InfoUser{
  username: string;
  email: string;
  date: any;
  action: string;

  constructor(username: string, email: string, date: any, action:string) {
    this.username = username;
    this.email = email;
    this.date = date;
    this.action = action;
  }
}