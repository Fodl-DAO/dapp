import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { AssetSymbolPipeModule } from '../../pipes/asset-symbol/asset-symbol.pipe.module';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { FoldingService } from '../../services/folding/folding.service';
import { FoldingServiceMock } from '../../services/folding/folding.service.mock';

import { BorrowLimitComponent } from './borrow-limit.component';

describe('BorrowLimitComponent', async () => {
    let fixture: ComponentFixture<BorrowLimitComponent>;
    let component: BorrowLimitComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [AssetSymbolPipeModule, FormatValuePipeModule],
                declarations: [BorrowLimitComponent],
                providers: [
                    {
                        provide: FoldingService,
                        useClass: FoldingServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(BorrowLimitComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
