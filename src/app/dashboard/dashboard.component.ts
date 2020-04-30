import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    states = {}

    constructor(private socket: SocketService) {
    }

    ngOnInit() {
        if (!this.socket.isOpen())
            this.socket.connect();

        this.socket.onMessage.subscribe(
            (message) => {

                console.log('message', message);
            }
        )

        this.getStatus()
    }

    toggleMain(): void {
        this.socket.send({method: "s", zone: 0, fct: "pwr", value: 2})
    }

    toggleZone2(): void {
        this.socket.send({method: "s", zone: 1, fct: "pwr", value: 2})
    }

    private getStatus(): void {
        this.socket.send({method: 'g', zone: 0, fct: 'st', value: 0})
    }

}
