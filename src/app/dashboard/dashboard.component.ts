import {Component, ComponentRef, OnInit, Renderer2} from '@angular/core';
import {SocketService} from "../socket.service";
import {timer} from "rxjs";
import {BaseComponent} from "../base-component";
import {switchAnimation} from "../animations";
import {CdkPortalOutletAttachedRef, ComponentPortal, DomPortalHost, Portal} from "@angular/cdk/portal";
import {VolumeControlComponent} from "../volume-control/volume-control.component";
import {SliderComponent} from "../slider/slider.component";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [switchAnimation.flip]
})
export class DashboardComponent extends BaseComponent implements OnInit {

    states = {
        power: {main: false, zone2: false},
        volume: {main: '0', zone2: '0'},
        listeningMode: 'none'
    }

    rawVolumes = {
        main: 0,
        zone2: 0
    }

    listeningModes = [
        {title: 'auto', tag: 'auto'},
        {title: 'stereo', tag: 'stereo'},
        {title: 'ext-stereo', tag: 'achst'},
        {title: 'dolby', tag: 'dolby'},
    ]

    showVolumeSlider = false;
    volumeSliderAnimState = '';

    selectedPortal: Portal<any>;

    volumeControlPortal: ComponentPortal<VolumeControlComponent>;
    volumeSliderPortal: ComponentPortal<SliderComponent>;


    constructor(private socket: SocketService,
                protected renderer: Renderer2) {
        super(renderer);
    }

    ngOnInit() {
        this.volumeControlPortal = new ComponentPortal(VolumeControlComponent);
        this.volumeSliderPortal = new ComponentPortal(SliderComponent);

        this.selectedPortal = this.volumeSliderPortal;

        this.initSockets();
        this.initStatusUpdate();
    }

    onComponentAttached(ref): void {
        // console.log('here');
        if (ref.instance instanceof SliderComponent) {
            const i = ref.instance as SliderComponent;
            i.value = this.rawVolumes.main;
            i.valueChange.subscribe((value) => {
                console.log(value);
            })
            ref.changeDetectorRef.detectChanges();
        }

        if (ref.instance instanceof VolumeControlComponent) {
            const i = ref.instance as VolumeControlComponent;
            i.value = this.states.volume.main;
            i.onVolumeIncrease.subscribe( () => this.increaseVolume(0) )
            i.onVolumeDecrease.subscribe( () => this.decreaseVolume(0) )

            ref.changeDetectorRef.detectChanges();
        }
    }

    sliderChange(evt): void {
        this.socket.send(this.getMsg('s', 0, 'dvl', evt))
    }

    toggleZonePwr(zone: number): void {
        this.socket.send(this.getMsg('s', zone, 'pwr', 2))
    }

    toggleMute(zone: number): void {
        this.socket.send(this.getMsg('s', zone, 'mute', 0));
    }

    increaseVolume(zone): void {
        this.socket.send(this.getMsg('s', zone, 'vol', 2));
    }

    decreaseVolume(zone): void {
        this.socket.send(this.getMsg('s', zone, 'vol', -2));
    }

    loadDefaultEq(): void {
        this.socket.send(this.getMsg('s', 0, 'eq', -2));
    }

    setListeningMode(mode): void {
        this.socket.send(this.getMsg('s', 0, 'lm', mode));
    }

    changeVolumeMode(): void {
        if(this.showVolumeSlider) {
            this.selectedPortal = this.volumeSliderPortal;
        } else {
            this.selectedPortal = this.volumeControlPortal;
        }

        this.showVolumeSlider = !this.showVolumeSlider;

        // this.volumeSliderAnimState = this.showVolumeSlider ? '' : 'flipped';
        // console.log('anim state', this.volumeSliderAnimState);
    }

    animationDone(event): void {
        if (event.fromState === '' && event.toState == 'flip') {
            console.log('done animating from "" => "flipped"');
            // console.log('animation done evt', event);
            // this.showVolumeSlider = !this.showVolumeSlider;
            setTimeout(() => {
                this.showVolumeSlider = !this.showVolumeSlider;
            }, 1000)
        }
        console.log('animation done evt', event);
    }

    protected onComponentVisible(): void {
        super.onComponentVisible();
        if (!this.socket.isOpen()) this.socket.connect();
    }

    private initSockets(): void {
        if (!this.socket.isOpen())
            this.socket.connect();

        const s = this.socket.onMessage.subscribe(
            (res: { success: boolean, message: string, data: any }) => {
                if (res) {
                    if (res.message === 'status') {
                        this.states.power = res.data.power;
                        this.states.volume.main = this.calculateDbValue(res.data.volume.main);
                        this.states.volume.zone2 = this.calculateDbValue(res.data.volume.zone2);

                        this.rawVolumes = res.data.volume;

                        this.states.listeningMode = res.data.listeningMode;
                    }
                }
            }
        )
        this.addSub(s)
    }

    private initStatusUpdate(): void {
        const timerSub = timer(0, 2000)
            .subscribe((res) => this.getStatus())
        this.addSub(timerSub)
    }


    private getStatus(): void {
        this.socket.send({method: 'g', zone: 0, fct: 'st', value: 0})
    }

    private getMsg(method: string, zone: number, fct: string, value: string | number): any {
        return {method, zone, fct, value};
    }

    private calculateDbValue(raw: number): string {
        const value = -(82.0 - raw / 2);
        return Number(value).toFixed(1);
    }

}
