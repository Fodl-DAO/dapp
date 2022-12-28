import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-pair',
    templateUrl: './icon-pair.component.html',
})
export class IconPairComponent {
    @Input() asset1: string;
    @Input() assetName1: string;
    @Input() assetDescription1: string;

    @Input() asset2: string;
    @Input() assetName2: string;
    @Input() assetDescription2: string;

    @Input() size = 'medium';
}
