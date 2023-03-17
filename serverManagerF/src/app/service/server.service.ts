import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  servers$ = (): Observable<CustomResponse> =>
    this.http
      .get<CustomResponse>(`${this.apiUrl}/servers`)
      .pipe(tap(console.log), catchError(this.handleError));

  save$ = (server: Server): Observable<CustomResponse> =>
    this.http
      .post<CustomResponse>(`${this.apiUrl}/servers`, server)
      .pipe(tap(console.log), catchError(this.handleError));

  ping$ = (ipAddress: string): Observable<CustomResponse> =>
    this.http
      .get<CustomResponse>(`${this.apiUrl}/servers/ping/${ipAddress}`)
      .pipe(tap(console.log), catchError(this.handleError));

  delete$ = (serverId: number): Observable<CustomResponse> =>
    this.http
      .delete<CustomResponse>(`${this.apiUrl}/servers/${serverId}`)
      .pipe(tap(console.log), catchError(this.handleError));

  filter$ = (
    status: Status,
    response: CustomResponse
  ): Observable<CustomResponse> =>
    new Observable<CustomResponse>((subscrber) => {
      console.log(response);
      subscrber.next(
        status === Status.ALL
          ? { ...response, message: `Servers filtered by ${status} status` }
          : {
              ...response,
              message:
                response.data.servers.filter(
                  (server: Server) => server.status === status
                ).length > 0
                  ? `Servers filterd by ${
                      status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'
                    } status`
                  : `No server of ${status} found`,
              data: {
                servers: response.data.servers.filter(
                  (server: Server) => server.status === status
                ),
              },
            }
      );
      subscrber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code:  ${error.status}`);
  }
}
