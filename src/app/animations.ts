import {animate, AnimationTriggerMetadata, query, stagger, state, style, transition, trigger} from '@angular/animations';


export const slideAnimations: {
    readonly slideOut: AnimationTriggerMetadata;
    readonly slideIn: AnimationTriggerMetadata;
} = {
    slideOut: trigger('slideOut', [
        state('inBottom', style({transform: 'translateY(0px)'})),
        state('outBottom', style({transform: 'translateY({{h}}px)'}), {params: {h: -1000, duration: 200}}),
        transition('* => outBottom', [
            animate('{{duration}}ms ease')
        ]),
    ]),
    slideIn: trigger('slideIn', [
        state('bottom', style({transform: 'translateY({{h}}px)'}), {params: {h: 500, duration: 200}}),
        state('inBottom', style({transform: 'translateY(0px)'}), {params: {h: 500, duration: 200}}),
        transition('bottom => inBottom', [
            animate('{{duration}}ms ease')
        ]),
    ])
};

export const listItemAnimations: {
    readonly slideOut: AnimationTriggerMetadata;
} = {
    slideOut: trigger('listItemSlide', [
        state('idle', style({transform: 'translate(0px, 0px)'})),
        state('outLeft', style({transform: 'translate({{containerWidth}}px, 0)'}), {params: {containerWidth: 1000}}),
        state('outRight', style({transform: 'translate(-{{containerWidth}}px, 0)'}), {params: {containerWidth: -1000}}),
        transition('* => outLeft', [
            animate('200ms ease', style({
                transform: 'translate({{containerWidth}}px,0px)'
            }))
        ]),
        transition('* => outRight', [
            animate('200ms ease', style({
                transform: 'translate(-{{containerWidth}}px,0px)'
            }))
        ]),
        transition('* => idle', [
            animate('200ms ease', style({
                transform: 'translate(0px,0px)'
            }))
        ]),
    ])
};

export const timerDisplayAnimations: {
    readonly scale: AnimationTriggerMetadata;
} = {
    scale: trigger('scale', [
        state('clicked', style({opacity: 1})),
        state('error', style({opacity: 1, 'border-color': '#BF950B'})),
        transition('* => clicked', [
            animate('{{timeout}}ms ease-out',
                style({transform: 'scale(1.2)', opacity: 0})
            ),
            animate('20ms ease-out',
                style({transform: 'scale(1.0)', opacity: 0})
            ),
            animate('50ms ease-out',
                style({transform: 'scale(1.0)', opacity: 1})
            )
        ], {params: {timeout: 200}}),
        transition('* => error', [
            animate('55ms ease-out',
                style({transform: 'scale(1.1)', opacity: 1})
            ),
            animate('50ms ease-out',
                style({transform: 'scale(0.85)', opacity: 1})
            ),
            animate('35ms ease-out',
                style({transform: 'scale(1.05)', opacity: 1})
            ),
            animate('30ms ease-out',
                style({transform: 'scale(0.9)', opacity: 1})
            ),
            animate('30ms ease-out',
                style({transform: 'scale(1.0)', opacity: 1})
            ),
        ], {params: {timeout: 200}}),
    ]),
};

export const switchAnimation: {
    readonly flip: AnimationTriggerMetadata;
} = {
    flip: trigger('flip', [
        state('flipped', style({transform: `rotate3d(0,1,0, 90deg)`, visibility: 'hidden'})),
        transition("* => flipped", [
            animate('500ms ease-out',
                style({transform: 'rotate3d(0,1,0, 90deg)'})
            )
        ]),
        transition("* => *", [
            animate('500ms ease-out',
                style({transform: 'rotate3d(0,1,0, 0deg)'})
            )
        ])
    ])
}
