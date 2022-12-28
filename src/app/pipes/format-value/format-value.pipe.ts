import { Pipe, PipeTransform } from '@angular/core';

import { formatValue } from '../../utilities/formatValue';

@Pipe({
    name: 'formatValue',
})
export class FormatValuePipe implements PipeTransform {
    transform(value: number | string): string {
        return formatValue(value as number);
    }
}
