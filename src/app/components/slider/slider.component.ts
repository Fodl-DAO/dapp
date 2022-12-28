import {
    Component,
    forwardRef,
    Input,
    OnChanges,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SliderTicksType } from './slider.ticks.type';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderComponent),
            multi: true,
        },
    ],
    encapsulation: ViewEncapsulation.None,
})
export class SliderComponent implements OnChanges, ControlValueAccessor {
    @Input() disabled?: boolean = false;
    @Input() showTicks?: boolean = true;
    @Input() ticksType?: SliderTicksType = 'all';
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;

    private _value: number;
    private _onChange = (value: number) => {};
    private _onTouched = () => {};
    public _isTicksInteger = false;
    public _ticks: number[];

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;
        this._onChange(this._value);
        this._onTouched();
    }

    ngOnChanges(): void {
        if (this.min >= this.max) {
            this._ticks = [];
            throw new Error("Min value can't be greater than max");
        }
        this.updateTicks();
    }

    public updateTicks(): void {
        this._ticks =
            this.ticksType === 'all'
                ? this.getAllTicks()
                : [this.min, this.max];

        this._isTicksInteger = this._ticks.every((tick) => {
            Number.isInteger(tick);
        });
    }

    public getAllTicks(): number[] {
        const sliderParts = 4;
        const ticks = [this.min];
        let previousVal = ticks[0];

        for (let i = 1; i < sliderParts; i++) {
            const step = previousVal + (this.max - this.min) / sliderParts;
            previousVal = step;
            ticks.push(this.roundValue(step));
        }

        ticks.push(this.max);
        return ticks;
    }

    public roundValue(value: number): number {
        const rangeDiff = this.max - this.min;
        if (rangeDiff <= 2) {
            return Math.round(value * 100) / 100;
        }
        if (rangeDiff <= 10) {
            return Math.round(value * 10) / 10;
        }
        return Math.trunc(value);
    }

    writeValue(value: number): void {
        this._value = value;
    }

    registerOnChange(fn: (value: number) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }
}
