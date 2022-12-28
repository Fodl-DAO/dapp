import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogModule,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { AssetSymbolPipeModule } from '../../pipes/asset-symbol/asset-symbol.pipe.module';
import { FormatExchangeRatePipeModule } from '../../pipes/format-exchange-rate/format-exchange-rate.pipe.module';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { FoldingService } from '../../services/folding/folding.service';
import { FoldingServiceMock } from '../../services/folding/folding.service.mock';

import { DialogModule } from '../dialog/dialog.module';

import { StopLossSettingsComponent } from './stop-loss-settings.component';

describe('StopLossSettingsComponent', async () => {
    let fixture: ComponentFixture<StopLossSettingsComponent>;
    let component: StopLossSettingsComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [StopLossSettingsComponent],
                imports: [
                    MatButtonModule,
                    MatDialogModule,
                    MatIconModule,
                    MatSliderModule,
                    AssetSymbolPipeModule,
                    FormatExchangeRatePipeModule,
                    FormatValuePipeModule,
                    DialogModule,
                ],
                providers: [
                    {
                        provide: MAT_DIALOG_DATA,
                        useValue: {},
                    },
                    {
                        provide: MatDialogRef,
                        useValue: {},
                    },
                    {
                        provide: FoldingService,
                        useValue: FoldingServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(StopLossSettingsComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
