import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class Socket2Service {

    private socket: WebSocketSubject<any> = webSocket(`${environment.api.baseUrl}/socket`);

    constructor() {
    }
}
