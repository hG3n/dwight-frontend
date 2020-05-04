import {
    AfterViewChecked, AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {Util} from "../lib/Util";
import {migrateLegacyGlobalConfig} from "@angular/cli/utilities/config";

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() value: number;

    @Input() knobHeight = 24;
    @Input() sliderRange = [0, 100]
    @Input() updateRate = 10;
    @Input() sliderWidth = 72;

    @Output() valueChange = new EventEmitter<number>();

    @ViewChild('container', {static: true}) private sliderContainer: ElementRef;
    @ViewChild('knob', {static: true}) private sliderKnob: ElementRef;

    private containerTop = 0;
    private containerSize = 0;
    private currentSliderTop = 0
    private lastValue = 0;

    private updateCtr = 0;

    constructor(private renderer: Renderer2) {
    }

    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        this.containerSize = this.sliderContainer.nativeElement.offsetHeight;
        this.containerTop = this.sliderContainer.nativeElement.offsetTop;
        console.log('setting container top', this.containerTop, this.sliderContainer, this.sliderContainer.nativeElement.offsetTop);

        this.renderer.setStyle(this.sliderKnob.nativeElement, 'height', `${this.knobHeight}px`)
        this.renderer.setStyle(this.sliderContainer.nativeElement, 'width', `${this.sliderWidth}px`)
        console.log('value', this.value);

        this.initialize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('here');
    }


    panStart(event): void {
        this.currentSliderTop = event.target.offsetTop;
    }

    pan(event): void {
        console.log(event.center.y);
        const new_value = this.calculateNewPosition(event.center.y)
        if (new_value === this.lastValue)
            return;

        const mapped_value = Util.mapToRange(
            new_value, 0, this.containerSize - this.knobHeight,
            this.sliderRange[0], this.sliderRange[1],)

        if (this.updateCtr % this.updateRate === 0) {
            this.valueChange.emit(this.sliderRange[1] - Math.floor(mapped_value));
            this.updateCtr = 0;
        }

        this.updateCtr++;

        this.moveKnob(new_value)
        this.lastValue = new_value;
    }

    panEnd(event): void {
        const new_value = this.calculateNewPosition(event.center.y);
        const mapped_value = Util.mapToRange(
            new_value, 0, this.containerSize - this.knobHeight,
            this.sliderRange[0], this.sliderRange[1],)
        this.valueChange.emit(this.sliderRange[1] - Math.floor(mapped_value));
    }

    initialize(): void {

        const reverse_mapped = Util.mapToRange(this.value,
            this.sliderRange[0], this.sliderRange[1], this.containerSize - this.knobHeight, 0);
        this.moveKnob(reverse_mapped);
    }

    /**
     * @param y
     */
    private calculateNewPosition(y: number): number {
        console.log('y = ', y, 'top', this.containerTop);
        let new_value = y - this.containerTop ;
        if (new_value <= 0) {
            new_value = 0;
        } else if (new_value >= this.containerSize - this.knobHeight) {
            new_value = this.containerSize - this.knobHeight
        }
        return new_value;
    }

    /**
     * Move the knob to the specified position.
     * Uses absolute placement via 'top'
     * @param position
     */
    private moveKnob(position: number): void {
        this.renderer.setStyle(this.sliderKnob.nativeElement, 'top', `${position}px`)
    }
}
