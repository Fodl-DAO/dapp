import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-pair-platform',
    templateUrl: './icon-pair-platform.component.html',
})
export class IconPairPlatformComponent {
    @Input() supplyAsset: string;
    @Input() supplyAssetName: string;

    @Input() borrowAsset: string;
    @Input() borrowAssetName: string;

    @Input() platformName: string;
}
