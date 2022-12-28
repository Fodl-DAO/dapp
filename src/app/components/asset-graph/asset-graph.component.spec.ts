import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetGraphComponent } from './asset-graph.component';

import { GeckoPriceService } from '../../services/gecko-price/gecko-price.service';
import { EthereumService } from '../../services/ethereum/ethereum.service';

import { GeckoPriceServiceMock } from '../../services/gecko-price/gecko-price.service.mock';
import { EthereumServiceMock } from '../../services/ethereum/ethereum.service.mock';

describe('AssetGraphComponent', () => {
    let component: AssetGraphComponent;
    let fixture: ComponentFixture<AssetGraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AssetGraphComponent],
            providers: [
                {
                    provide: GeckoPriceService,
                    useClass: GeckoPriceServiceMock,
                },
                {
                    provide: EthereumService,
                    useClass: EthereumServiceMock,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AssetGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
