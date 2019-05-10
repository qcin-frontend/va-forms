import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpErrorResponse, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()

export class APIService {
  token : string
  headers : any
  opts : any
  request : any

  projectURL: string = '../assets/APIData/';
  UI_JSON: string = '../assets/UI_JSON/';
  localURL: string = 'http://localhost:3000';
  // localURL2: string = 'http://192.168.15.161:5000';
  localURL2: string = 'http://13.223.138.181:5000';
  current_URL : string = this.localURL;
  Header: any;
  appHeader: any = new HttpHeaders({ 'Autherization'  : 'true' });

  // UI_JSON: string = '../assets/';
  api_url: "http://192.168.15.146:5000/"
  
  constructor(private http: HttpClient) {}

  setHeader() {
    let token = localStorage.getItem('token');
    // console.log(token);
    this.appHeader = new HttpHeaders({'Authorization': ""+token});
    this.appHeader.append({'Content-Type':'application/json'});
    // console.log(token);
  }

  Login(data) {
    data = JSON.stringify(data);
    const request = new HttpRequest('POST', this.localURL2+"/opentok/login", data , { reportProgress: true});
    return this.http.request(request)
  }

  GetChatUsers() {
    this.setHeader()
    const request = new HttpRequest('GET', this.localURL2+"/opentok/getUsers", { reportProgress: true, headers: this.appHeader });
    return this.http.request(request)
  }

  StartArchive(data) {
    this.setHeader()
    const request = new HttpRequest('POST', this.localURL2+"/opentok/archive", data , { reportProgress: true, headers: this.appHeader });
    return this.http.request(request)
  }
  
  Get_Admin_UI(){
    const request = new HttpRequest('GET', "http://192.168.15.146:5000/opentok/getform" , { reportProgress: true, headers: this.appHeader })
    return this.http.request(request)
  }

  post_Radio(data:any){
    const request = new HttpRequest('POST', this.UI_JSON+'fields.json', JSON.stringify(data), { reportProgress: true, headers: this.appHeader })
    return this.http.request(request)
  }
  
  InitiateSession(data) {
    this.setHeader()
    const request = new HttpRequest('POST', this.localURL2+"/opentok/createSession", data , { reportProgress: true, headers: this.appHeader });
    return this.http.request(request)
  }

  EndSession(data) {
    this.setHeader()
    const request = new HttpRequest('POST', this.localURL2+"/opentok/disconnectSession", data , { reportProgress: true, headers: this.appHeader });
    return this.http.request(request)
  }

}