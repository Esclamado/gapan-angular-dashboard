import { Router } from "@angular/router";
import { SessionStorageService } from "ngx-webstorage";
import { Injectable } from "@angular/core";
import { jwt } from "./../jwt/jwt";
import { cookie } from "./../cookie/cookie";
import { urls } from "./../urls/urls";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";
import * as moment from "moment";
import "moment/locale/en-gb";

@Injectable({
  providedIn: "root"
})
export class env {
  private secure = false;
  private domain = environment.domain;

  private url = environment.url;
  private secureUrl = environment.url;
  
  private devicetoken = "no-device";
  private deviceid = "no-device";

  private apikey =
    "vmvm1xj0oeznryyd6ujdxogf6jhwiuh1oa1bbhaie1eubdtt61w3cqkkrx85d5ai8upbzsqlsp6hga0jl1nh1luiugae2dbzs1oudie9oakfu1nofhnyl434i0cpjoftvo31ikce3y2o4esf1hs9zo55v2xjg8nsiwz6jxcu5shlbnisgyvsbtfbldfxklszqpkizpnb";

  public _SUPERADMIN = 1;
  public _ADMIN = 2;
  public _SALES = 3;
  public _PRODUCTIONPLANNER = 4;
  public _PRODUCTIONMANAGER = 5;
  public _PRESSOPERATOR = 6;

  constructor(
    private http: HttpClient,
    private cookie: cookie,
    public session: SessionStorageService,
    public router: Router
  ) {}
  getUrl(path: string): any {
    let url = "";
    if (this.secure == true) {
      url += this.secureUrl;
    } else {
      url += this.url;
    }
    url += path;
    return url;
  }

  createUrlParam(p) {
    let uriStr = "?";
    for (let key of Object.keys(p)) {
      if (p[key]) {
        uriStr += key + "=" + p[key] + "&";
      }
    }
    return uriStr;
  }

  getToken(): string {
    return "true";
  }
  setToken(token: any, day: number = 0): any {
    this.cookie.setCookie("token", token, day, "/", this.domain); // '.'+
  }

  getCookie(name: string): any {
    return this.cookie.getCookie(name);
  }

  deleteCookie(): any {
    return this.cookie.deleteCookie("token", this.domain); //'.'+
  }

  generateToken() {
    let token = this.session.retrieve("token");
    if (!token) {
      let tz = jwt.getTimezone();
      let token = jwt.setAlgo("HS256")
        .setClaim("token", "exchange")
        .setClaim("tzoffset", tz.gmt)
        .setClaim("tzname", tz.name)
        .setIssuedAt()
        .setSecret(this.apikey)
        .getToken();
      return token;
    } else {
      return token;
    }
  }

  getHttpOptions() {
    return new Promise(resolve => {
        let httpOptions = {
            headers: new HttpHeaders({
                Authorization: "Bearer " + this.generateToken(),
                Devicetoken: this.devicetoken,
                Deviceid: this.deviceid
            })
        };
        resolve(httpOptions);
    });
    /* let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.generateToken(),
        Devicetoken: this.devicetoken,
        Deviceid: this.deviceid
      })
    };
    return httpOptions; */
  }

  exchangeToken() {
    let token = this.getCookie("token");
    if (!token.length) {
        this.getHttpOptions().then(httpOptions => {
            let url = this.getUrl(urls.get_token) + "?device_token=" + this.devicetoken;
            return this.http.get<any>(url, httpOptions).subscribe(data => {
                this.setToken(data.data.token);
            });
        });
      /* let httpOptions = this.getHttpOptions();
      let url =
        this.getUrl(urls.get_token) + "?device_token=" + this.devicetoken;
      return this.http.get<any>(url, httpOptions).subscribe(data => {
        this.setToken(data.data.token);
      }); */
    }
  }
}
