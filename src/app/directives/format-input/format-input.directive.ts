import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    forwardRef,
    OnChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

import { numberWithCommas } from '../../utilities/numberWithCommas';

@Directive({
    selector: 'input[appFormatInput]',
    providers: [
        {
            provide: MAT_INPUT_VALUE_ACCESSOR,
            useExisting: FormatInputDirective,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormatInputDirective),
            multi: true,
        },
    ],
})
export class FormatInputDirective implements ControlValueAccessor, OnChanges {
    @Input('symbol') symbol: string;

    private mValue: number | null;
    private el: HTMLInputElement;

    onChange: (value: number) => void;
    onTouched: () => void;

    constructor(private elementRef: ElementRef<HTMLInputElement>) {
        this.el = this.elementRef.nativeElement;
    }

    get value(): number | null {
        return this.mValue;
    }

    @Input('value')
    set value(value: number | null) {
        this.mValue = value;
        this.formatValue(value);
    }

    ngOnChanges(): void {
        this.symbol = this.symbol ? this.symbol : '';
        this.formatValue(this.mValue);
    }

    formatValue(value: number | string | null) {
        if (!value) {
            this.el.value = '';
            return;
        }

        const formatted = numberWithCommas(value);
        this.el.value = this.symbol ? formatted + this.symbol : formatted;
    }

    unformatValue() {
        let initVal = this.isExponentVal(this.el.value)
            ? this.getNoExponentValString(Number(this.el.value))
            : this.el.value;

        this.mValue = Number(this.getOnlyNumString(initVal));

        if (!initVal) {
            this.el.value = '';
            return;
        }

        this.el.value =
            this.el.value.includes('e') || this.el.value.includes('E')
                ? initVal
                : this.mValue.toString();
    }

    private isExponentVal(value: number | string) {
        if (!value) {
            return false;
        }

        if (typeof value === 'number') {
            value = value.toString();
        }

        return value.includes('e') || value.includes('E');
    }

    private getNoExponentValString(value: number): string {
        const data = String(value).split(/[eE]/);

        if (data.length === 1) {
            return data[0];
        }

        let zeros = '',
            sign = value < 0 ? '-' : '',
            mag = Number(data[1]) + 1,
            str = data[0].replace('.', '');

        if (mag < 0) {
            zeros = sign + '0.';

            while (mag++) {
                zeros += '0';
            }

            return zeros + str.replace(/^-/, '');
        }

        mag -= str.length;

        while (mag--) {
            zeros += '0';
        }

        return str + zeros;
    }

    private getOnlyNumString(value: string) {
        value = value.trimStart().split(' ')[0];

        const searchBefore = new RegExp(/[^\d.]/g);
        const searchAfter = new RegExp(/\.([.\d]+)$/);

        const replacer = (m) => {
            const searchDot = new RegExp(/\./g);
            return '.' + m.replace(searchDot, '');
        };

        return value.replace(searchBefore, '').replace(searchAfter, replacer);
    }

    @HostListener('input', ['$event', '$event.target.value'])
    onInput(event, value): void {
        const initVal = this.el.value;
        const onlyNumString = this.getOnlyNumString(value);

        this.el.value = onlyNumString;

        if (initVal !== this.el.value) {
            event.stopPropagation();
        }

        this.mValue = Number(onlyNumString);
        this.onChange(this.mValue);
    }

    @HostListener('focus')
    onFocus(): void {
        this.unformatValue();
    }

    @HostListener('blur')
    onBlur(): void {
        this.formatValue(this.mValue);
    }

    writeValue(value: any) {
        this.mValue = value;
        this.formatValue(this.mValue);
    }

    registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }
}
