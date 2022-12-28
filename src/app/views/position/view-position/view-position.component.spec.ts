import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FoldingService } from '../../../services/folding/folding.service';
import { FoldingServiceMock } from '../../../services/folding/folding.service.mock';
import { MarketsServiceMock } from '../../../services/markets/markets.service.mock';
import { MarketsService } from '../../../services/markets/markets.service';
import { EthereumServiceMock } from '../../../services/ethereum/ethereum.service.mock';
import { ConfigurationService } from '../../../services/configuration/configuration.service';
import { ConfigurationServiceMock } from '../../../services/configuration/configuration.service.mock';
import { ERC20Service } from '../../../services/erc20/erc20.service';
import { ERC20ServiceMock } from '../../../services/erc20/erc20.service.mock';
import { EthereumService } from '../../../services/ethereum/ethereum.service';
import { GeckoPriceService } from '../../../services/gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../../../services/gecko-price/gecko-price.service.mock';
import { FoldingPositionsService } from '../../../services/folding/foldingPositions/foldingPositions.service';
import { FoldingPositionsServiceMock } from '../../../services/folding/foldingPositions/foldingPositions.service.mock';

import { ViewPositionComponent } from './view-position.component';

describe('ViewPositionComponent', async () => {
    let fixture: ComponentFixture<ViewPositionComponent>;
    let component: ViewPositionComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule.withRoutes([]),
                    HttpClientTestingModule,
                    MatDialogModule,
                ],
                declarations: [ViewPositionComponent],
                providers: [
                    {
                        provide: FoldingService,
                        useClass: FoldingServiceMock,
                    },
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
                        provide: MatDialogRef,
                        useValue: {},
                    },
                    {
                        provide: GeckoPriceService,
                        useClass: GeckoPriceServiceMock,
                    },
                    {
                        provide: FoldingPositionsService,
                        useClass: FoldingPositionsServiceMock,
                    },
                    {
                        provide: MarketsService,
                        useClass: MarketsServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewPositionComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
