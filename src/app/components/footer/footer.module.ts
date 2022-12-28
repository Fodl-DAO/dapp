import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfigurationService } from '../../services/configuration/configuration.service';

import { FooterComponent } from './footer.component';

@NgModule({
    declarations: [FooterComponent],
    imports: [CommonModule],
    providers: [ConfigurationService],
    exports: [FooterComponent],
})
export class FooterModule {}
