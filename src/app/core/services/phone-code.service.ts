import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PhoneCodeService{
  private url = 'assets/archives/phone-code-es.json';

  constructor(private http: HttpClient) {}

  getPhoneCodes(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }


}
