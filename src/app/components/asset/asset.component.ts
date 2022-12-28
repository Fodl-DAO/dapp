import { Component, Input } from '@angular/core';
import { IAsset } from '../../interfaces/asset.interface';

@Component({
    selector: 'app-asset',
    templateUrl: './asset.component.html',
})
export class AssetComponent {
    @Input() asset: IAsset;
}
