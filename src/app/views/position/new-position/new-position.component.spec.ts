import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConfigurationService } from '../../../services/configuration/configuration.service';
import { ConfigurationServiceMock } from '../../../services/configuration/configuration.service.mock';
import { ERC20Service } from '../../../services/erc20/erc20.service';
import { ERC20ServiceMock } from '../../../services/erc20/erc20.service.mock';
import { EthereumService } from '../../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../../services/ethereum/ethereum.service.mock';
import { FoldingService } from '../../../services/folding/folding.service';
import { FoldingServiceMock } from '../../../services/folding/folding.service.mock';
import { FoldingMarketsService } from '../../../services/folding/foldingMarkets/foldingMarkets.service';
import { FoldingMarketsServiceMock } from '../../../services/folding/foldingMarkets/foldingMarkets.service.mock';
import { GeckoPriceService } from '../../../services/gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../../../services/gecko-price/gecko-price.service.mock';
import { MarketsService } from '../../../services/markets/markets.service';
import { MarketsServiceMock } from '../../../services/markets/markets.service.mock';
import { SettingsService } from '../../../services/settings/settings.service';

import { NewPositionComponent } from './new-position.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NewPositionComponent', async () => {
    let fixture: ComponentFixture<NewPositionComponent>;
    let component: NewPositionComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule.withRoutes([]),
                    HttpClientTestingModule,
                    MatProgressSpinnerModule,
                    MatDialogModule,
                    MatSnackBarModule,
                ],
                declarations: [NewPositionComponent],
                providers: [
                    SettingsService,
                    FormatValuePipeModule,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
                    },
                    {
                        provide: MatSnackBar,
                        useValue: {},
                    },
                    {
                        provide: ERC20Service,
                        useClass: ERC20ServiceMock,
                    },
                    {
                        provide: EthereumService,
                        useClass: EthereumServiceMock,
                    },
                    {
                        provide: FoldingService,
                        useClass: FoldingServiceMock,
                    },
                    {
                        provide: FoldingMarketsService,
                        useClass: FoldingMarketsServiceMock,
                    },
                    {
                        provide: GeckoPriceService,
                        useClass: GeckoPriceServiceMock,
                    },
                    {
                        provide: MarketsService,
                        useClass: MarketsServiceMock,
                    },
                ],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(NewPositionComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
