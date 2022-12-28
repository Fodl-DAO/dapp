import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputType } from './input.type';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
    @Output() onIncrease: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDecrease: EventEmitter<any> = new EventEmitter<any>();

    @Input() type: InputType;
    @Input() asset?: string;
    @Input() symbol: string;

    @Input() invalid: boolean = false;
    @Input() disabled?: boolean = false;
    @Input() readonly?: boolean = false;
    @Input() placeHolder?: string = '';
    @Input() name?: string = '';
    @Input() textAlign?: 'right' | 'left' = 'left';

    private _value: number;

    onChange: (value: number) => void;
    onTouched: () => void;

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    ngOnInit(): void {
        this.checkProps();
    }

    private checkProps(): void {
        if (this.type === 'buttons') {
            const isOnIncreaseExist = this.onIncrease.observers.length > 0;
            const isOnDecreaseExist = this.onDecrease.observers.length > 0;

            if (!isOnIncreaseExist || !isOnDecreaseExist) {
                throw new Error(
                    "Events (onIncrease) and (onDecrease) is required when app-input type is 'buttons'",
                );
            }
        }

        if (this.type === 'asset' && !this.asset) {
            throw new Error(
                "Property [asset] is required when app-input type is 'asset'",
            );
        }
    }

    handleOnIncrease(): void {
        this.onIncrease.emit();
    }

    handleOnDecrease(): void {
        this.onDecrease.emit();
    }

    writeValue(value: any) {
        this._value = value;
    }

    registerOnChange(fn: (value: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }
}
