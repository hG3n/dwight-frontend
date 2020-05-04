import {interval, Observable, of} from 'rxjs';
import {delay, map, take} from 'rxjs/operators';

export class Util {

    public static mapToRange(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    public static copyObj(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

    public static createTimeout(duration: number): Observable<void> {
        return of(null).pipe(delay(duration));
    }

    public static createTimer(duration: number, update_rate: number): Observable<number> {
        return interval(update_rate).pipe(
            take(duration / update_rate),
            map((value) => duration - ((value + 1) * update_rate))
        );
    }

    public static toQueryParams(obj: any): string {
        const str = '?' + Object.keys(obj).reduce(
            (a, k) => {
                a.push(k + '=' + encodeURIComponent(obj[k]));
                return a;
            },
            []
        ).join('&');
        return str;
    }
}
