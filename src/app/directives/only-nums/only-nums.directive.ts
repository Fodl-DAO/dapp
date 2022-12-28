import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import { ETH_DECIMALS } from '../../constants/networks/ethereum';

@Directive({
    selector: 'input[type=text][onlyNums]',
})
export class OnlyNumsDirective implements OnChanges {
    @Input() decimals?: number = ETH_DECIMALS;

    private el: HTMLInputElement;
    private regex: RegExp;

    constructor(private elementRef: ElementRef<HTMLInputElement>) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.decimals.currentValue) {
            // Allow decimal numbers with specified digits after dot.
            // The dot is only allowed once to occur
            this.regex = new RegExp(
                '^([0-9]?)+(\\.[0-9]{0,' + this.decimals + '}){0,1}$',
                'g',
            );
        }
    }

    @HostListener('beforeinput', ['$event'])
    onBeforeInput(event: InputEvent) {
        const current: string = this.el.value;

        const [startPosition, endPosition] = [
            this.el.selectionStart,
            this.el.selectionEnd,
        ];

        const next: string = [
            current.slice(0, startPosition),
            event.data,
            current.slice(endPosition),
        ].join('');

        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}
