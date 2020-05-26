import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {switchAnimation} from "../animations";

@Component({
    selector: 'app-volume-control',
    templateUrl: './volume-control.component.html',
    styleUrls: ['./volume-control.component.scss'],
    animations: [switchAnimation.flip]
})
export class VolumeControlComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    @Input() value: string;

    @Output() onVolumeIncrease = new EventEmitter();
    @Output() onVolumeDecrease = new EventEmitter();

    @Output() done = new EventEmitter();

    animationState = 'flippedOut';

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        this.animationState = 'none';
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }

    prepareDestroy(): void {
        console.log('control preparedestroy here');
        this.animationState = 'flipped';
    }

    onAnimationDone(event): void {
        if (event.fromState === 'none' && event.toState == 'flipped') {
            console.log('animation done control');
            this.done.emit();
        }
    }

}
