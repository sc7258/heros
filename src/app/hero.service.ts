import { Injectable } from '@angular/core';
import {Hero} from "./hero";
import {HEROES} from "./mock-heroes";
import {Observable, of} from "rxjs";
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // 웹 API 형식의 URL로 사용
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

  // // check!! of, from
  // getHeroes(): Observable<Hero[]> {
  //   this.messageService.add('HeroService: fetched heroes');
  //   return of(HEROES);
  // }

  getHeroes(): Observable<Hero[]>{
    //this.messageService.add('HeroService: fetched heroes');
    //return of(HEROES);

    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError( this.handleError<Hero[]>('getHeroes', []))
      )
      ;
  }

  // //??
  // getHero(id: number): Observable<Hero> {
  //   // 지금은 히어로의 `id` 프로퍼티가 항상 존재한다고 간주합니다.
  //   // 에러를 처리하는 방법은 다음 튜토리얼에 대해 알아봅니다.
  //   const hero = HEROES.find(t => t.id === id)?? {id:0, name:""};
  //   this.messageService.add('HeroService: fetched hero');
  //   return of(hero);
  // }
  getHero(id: Number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError( this.handleError<Hero>(`getHero id=${id}`))
      )
  }


  private log(message: string) : void {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * HTTP 요청이 실패한 경우를 처리합니다.
   * 애플리케이션 로직 흐름은 그대로 유지됩니다.
   * @param operation - 실패한 동작의 이름
   * @param result - 기본값으로 반환할 객체
   */
  private handleError<T>(operation = 'operation', result?: T){
    //return (error: any): Observable<T> => {
    return (error: any) => {

      // TODO: 리모트 서버로 에러 메시지 보내기
      console.error(error); // 지금은 콘솔에 로그를 출력합니다.

      // TODO: 사용자가 이해할 수 있는 형태로 변환하기
      this.log(`${operation} failed: ${error.message}`);

      // 애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환합니다.
      return of(result as T);
    };
  }

  //// error!! - result of put may not hero
  // updateHero(hero: Hero): Observable<Hero> {
  //   return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
  //     tap(_ => this.log(`updated hero id=${hero.id}`)),
  //     catchError(this.handleError<any>('updateHero'))
  //   );
  // }

  /** PUT: 서버에 저장된 히어로 데이터를 변경합니다. */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  // /** POST: 서버에 새로운 히어로를 추가합니다. */
  // addHero(hero: Hero): Observable<Hero> {
  //   return this.http.post(this.heroesUrl, hero, this.httpOptions).pipe(
  //     //tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
  //     catchError(this.handleError<any>('addHero'))
  //   );
  // }

  /** POST: 서버에 새로운 히어로를 추가합니다. */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: number) {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
}
