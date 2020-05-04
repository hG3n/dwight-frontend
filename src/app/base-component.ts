import {Subscription} from "rxjs";
import {OnDestroy, Renderer2} from "@angular/core";

export class BaseComponent implements OnDestroy {

    protected subscriptions: Subscription[] = [];
    protected onVisibilityFn: () => void;

    constructor(protected renderer: Renderer2) {
        this.initVisibilityChangeListener();
    }

    ngOnDestroy(): void {
        for (const s of this.subscriptions) {
            s.unsubscribe();
        }
        if (this.onVisibilityFn) {
            this.onVisibilityFn()
        }
    }

    protected onComponentVisible(): void {
    }

    protected addSub(sub: Subscription): void {
        this.subscriptions.push(sub);
    }

    private initVisibilityChangeListener(): void {
        this.onVisibilityFn = this.renderer.listen('document', 'visibilitychange',
            () => {
                if (!document.hidden) {
                    this.onComponentVisible();
                }
            }
        );
    }

}
