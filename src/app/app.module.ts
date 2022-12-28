import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';

import { ConfigurationService } from './services/configuration/configuration.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        AppRoutingModule,
        FooterModule,
        HeaderModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: ConfigurationService.factoryLoadConfig,
            deps: [ConfigurationService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
