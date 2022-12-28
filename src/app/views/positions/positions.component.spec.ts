import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssetSymbolPipeModule } from '../../pipes/asset-symbol/asset-symbol.pipe.module';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { ConfigurationServiceMock } from '../../services/configuration/configuration.service.mock';
import { ERC20Service } from '../../services/erc20/erc20.service';
import { ERC20ServiceMock } from '../../services/erc20/erc20.service.mock';
import { EthereumService } from '../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../services/ethereum/ethereum.service.mock';
import { FoldingService } from '../../services/folding/folding.service';
import { FoldingServiceMock } from '../../services/folding/folding.service.mock';
import { FoldingMarketsService } from '../../services/folding/foldingMarkets/foldingMarkets.service';
import { FoldingMarketsServiceMock } from '../../services/folding/foldingMarkets/foldingMarkets.service.mock';
import { FoldingPositionsService } from '../../services/folding/foldingPositions/foldingPositions.service';
import { FoldingPositionsServiceMock } from '../../services/folding/foldingPositions/foldingPositions.service.mock';
import { GeckoPriceService } from '../../services/gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../../services/gecko-price/gecko-price.service.mock';
import { SettingsService } from '../../services/settings/settings.service';

import { AprTooltipModule } from '../../components/apr-tooltip/apr-tooltip.module';
import { BorrowLimitBarModule } from '../../components/borrow-limit/borrow-limit-bar/borrow-limit-bar.module';
import { IconPairPlatformModule } from '../../components/icon-pair-platform/icon-pair-platform.module';
import { NewPositionButtonModule } from '../../components/new-position-button/new-position-button.module';
import { PaginatorModule } from '../../components/paginator/paginator.module';
import { PositionsComponent } from './positions.component';

describe('PositionsComponent', async () => {
    let fixture: ComponentFixture<PositionsComponent>;
    let component: PositionsComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule.withRoutes([]),
                    HttpClientTestingModule,
                    MatButtonModule,
                    MatCheckboxModule,
                    MatIconModule,
                    MatProgressSpinnerModule,
                    AssetSymbolPipeModule,
                    FormatValuePipeModule,
                    AprTooltipModule,
                    BorrowLimitBarModule,
                    IconPairPlatformModule,
                    NewPositionButtonModule,
                    PaginatorModule,
                ],
                declarations: [PositionsComponent],
                providers: [
                    SettingsService,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
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
                        provide: FoldingPositionsService,
                        useClass: FoldingPositionsServiceMock,
                    },
                    {
                        provide: GeckoPriceService,
                        useClass: GeckoPriceServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(PositionsComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
