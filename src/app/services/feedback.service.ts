import { Injectable } from '@angular/core';
import {Feedback} from '../shared/feedback';
import {Observable} from 'rxjs/Observable';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import {RestangularModule, Restangular} from 'ngx-restangular';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular, private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<any> {
    return this.restangular.all('feedback').post(feedback);
  }

}
