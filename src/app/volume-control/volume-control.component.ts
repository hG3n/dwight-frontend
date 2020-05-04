import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss']
})
export class VolumeControlComponent implements OnInit, OnChanges {

    @Input() value: string;

    @Output() onVolumeIncrease = new EventEmitter();
    @Output() onVolumeDecrease = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }

}
