import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-platform',
    templateUrl: './icon-platform.component.html',
})
export class IconPlatformComponent {
    @Input() platform?: string;
    @Input() platformName?: string;

    getPlatformIcon(): string {
        if (this.platformName.toLocaleLowerCase().split(/ /)[0] === 'aave') {
            return '/assets/aave-round.svg';
        }

        if (this.platformName.toLocaleLowerCase() === 'compound') {
            return '/assets/compound-round.svg';
        }

        if (this.platformName.toLocaleLowerCase() === 'cream') {
            return '/assets/cream-round.svg';
        }

        if (this.platformName.toLocaleLowerCase() === 'venus') {
            return '/assets/venus-round.svg';
        }

        if (this.platformName.toLocaleLowerCase() === 'fodl') {
            return '/assets/icons/0x4c2e59d098df7b6cbae0848d66de2f8a4889b9c3.svg';
        }

        return '';
    }
}
