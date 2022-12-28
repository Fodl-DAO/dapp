import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core';

import { ETH_DECIMALS } from '../../constants/networks/ethereum';

import { BigNumber, ethers } from 'ethers';
import { displayBigNumber } from 'src/app/utilities/displayBigNumber';

@Component({
    selector: 'app-big-number-input',
    templateUrl: './big-number-input.component.html',
    styleUrls: ['./big-number-input.component.scss'],
})
export class BigNumberInputComponent implements OnChanges {
    @Output() valueChange = new EventEmitter<BigNumber>();

    @Input() value: BigNumber;
    @Input() decimals?: number = ETH_DECIMALS;

    @Input() disabled?: boolean = false;
    @Input() readonly?: boolean = false;
    @Input() placeHolder?: string = '';
    @Input() name?: string = '';
    @Input() textAlign?: 'left' | 'center' = 'left';

    valueOnInput: string;

    readonly ETHERS_WRONG_VALUE_ERRORS = [
        'missing value',
        'invalid decimal value',
    ];

    ngOnChanges() {
        const displayValue = displayBigNumber(
            this.value,
            this.decimals,
            this.decimals,
        );
        this.valueOnInput = displayValue === '0' ? '' : displayValue;
    }

    onValueChange(): void {
        if (this.valueOnInput) {
            try {
                // Convert [string] from input to [BigNumber]
                const amount = ethers.utils.parseUnits(
                    this.valueOnInput,
                    this.decimals,
                );

                this.valueChange.emit(amount);
                return;
            } catch (error: any) {
                this.handleOnValueChangeError(error);
            }
        }

        this.valueChange.emit(ethers.constants.Zero);
    }

    private handleOnValueChangeError(error: any) {
        const reason = error?.reason;

        if (!this.ETHERS_WRONG_VALUE_ERRORS.includes(reason)) {
            console.error("Can't parse user input", error);
        }
    }
}
