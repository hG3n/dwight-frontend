import {Injectable} from '@angular/core';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';
import {Subject} from 'rxjs';
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    private route = '/interaction';
    private open = false;
    private socket: $WebSocket;

    // public onMessage = new BehaviorSubject(new Message());
    public onMessage = new Subject<any>();

    constructor() {
    }

    /**
     * Connect to Server
     */
    connect(): void {
        console.log('connecting to ');
        console.log(`${environment.api.baseUrl}/socket`);
        this.socket = new $WebSocket(`${environment.api.baseUrl}/socket`);
        this.socket.setSend4Mode(WebSocketSendMode.Direct);

        this.socket.onOpen(() => {
            this.open = true;
        });

        this.socket.onClose(() => {
            this.open = false;
        });

        this.socket.onMessage(
            (msg: MessageEvent) => {
                this.onMessage.next(JSON.parse(msg.data));
            },
            {autoApply: false}
        );

        this.socket.onError(
            (error) => {
                console.log('Error:', error);
            }
        );
    }

    /**
     * Check whether the connection is open
     * @return {boolean}
     */
    isOpen(): boolean {
        return this.open;
    }

    /**
     * Send message to server
     * @param request
     */
    send(message: any): void {
        this.socket.send(message);
    }
}
