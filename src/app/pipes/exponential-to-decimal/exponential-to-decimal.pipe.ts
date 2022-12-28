import { Pipe, PipeTransform } from '@angular/core';

import { exponentialToDecimal } from '../../utilities/exponentialToDecimal';

@Pipe({
    name: 'exponentialToDecimal',
})
export class ExponentialToDecimalPipe implements PipeTransform {
    transform(value: number | string): any {
        return exponentialToDecimal(value);
    }
}
