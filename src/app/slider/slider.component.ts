import {
    AfterViewInit,
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
import {switchAnimation} from "../animations";

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    animations: [switchAnimation.flip]
})
export class SliderComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() value: number;

    @Input() knobHeight = 24;
    @Input() sliderRange = [0, 100]
    @Input() updateRate = 10;
    @Input() sliderWidth = 72;

    @Output() valueChange = new EventEmitter<number>();
    @Output() done = new EventEmitter();

    @ViewChild('container', {static: true}) private sliderContainer: ElementRef;
    @ViewChild('knob', {static: true}) private sliderKnob: ElementRef;

    animationState = 'flippedOut'

    private containerTop = 0;
    private containerSize = 0;
    private lastValue = 0;

    private updateCtr = 0;

    constructor(private renderer: Renderer2) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.containerSize = this.sliderContainer.nativeElement.offsetHeight;
        this.containerTop = this.sliderContainer.nativeElement.offsetTop - this.containerSize;
        console.log('setting container top', this.containerTop, this.sliderContainer, this.sliderContainer.nativeElement.offsetTop);

        this.renderer.setStyle(this.sliderKnob.nativeElement, 'height', `${this.knobHeight}px`)
        this.renderer.setStyle(this.sliderContainer.nativeElement, 'width', `${this.sliderWidth}px`)

        this.initialize();
        this.animationState = 'none';
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Changes in Slider:', changes);
    }


    panStart(event): void {
        // this.currentSliderTop = event.target.offsetTop;
    }

    pan(event): void {
        const y = this.determineYValue(event);
        const new_value = this.calculateNewPosition(y);
        if (new_value === this.lastValue)
            return;

        const mapped_value = Util.mapToRange(
            new_value, 0, this.containerSize - this.knobHeight,
            this.sliderRange[0], this.sliderRange[1]
        )

        if (this.updateCtr % this.updateRate === 0) {
            this.valueChange.emit(this.sliderRange[1] - Math.floor(mapped_value));
            this.updateCtr = 0;
        }
        this.updateCtr++;

        this.lastValue = new_value;
    }

    panEnd(event): void {
    }

    /**
     * Reverse from absolute values to pixel coordinates.
     */
    initialize(): void {
        const reverse_mapped = Util.mapToRange(this.value,
            this.sliderRange[0], this.sliderRange[1],
            this.containerSize - this.knobHeight, 0);
        console.log(`value: ${+this.value} mapped to: ${reverse_mapped}`);

        this.renderer.removeStyle(this.sliderKnob.nativeElement, 'transform');
        this.renderer.setStyle(this.sliderKnob.nativeElement,
            'transform',
            `translate(0, ${reverse_mapped}px)`)
    }

    prepareDestroy(): void {
        console.log('slider preparedestroy here');
        this.animationState = 'flipped';
    }

    onAnimationDone(event): void {
        if (event.fromState === 'none' && event.toState == 'flipped') {
            console.log('animation done slider');
            this.done.emit();
        }
    }


    /**
     * Returns the current y value depending on the interaction events type.
     * @param event
     */
    private determineYValue(event: any): number {
        if (event.event instanceof TouchEvent) {
            return event.event.touches[0].clientY;
        }

        if (event.event instanceof MouseEvent) {
            return event.event.clientY;
        }
    }

    /**
     * Calculate the new knob position
     * @param y
     */
    private calculateNewPosition(y: number): number {
        // console.log(y, '---', this.containerSize - this.knobHeight);
        let new_value = y - this.containerTop;
        // console.log('hrere', new_value);
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
