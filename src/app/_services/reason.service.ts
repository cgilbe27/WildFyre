import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Choice } from '../_models/choice';

@Injectable()
export class ReasonService {
  flagChoices: Choice[] = [];

  constructor(
    private httpService: HttpService
  ) { }

  getFlagReasons(): Observable<Choice[]> {
    // get flag reasons from api
    return this.httpService.GET('/choices/flag/reasons/')
      .map(response => {
        const choices: Choice[] = [];
        for (let i = 0; i < response.length; i++) {
          choices.push(Choice.parse(response[i]))
        }
      return choices;
    });
  }
}
