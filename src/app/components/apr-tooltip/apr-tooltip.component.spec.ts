import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { MarketsService } from '../../services/markets/markets.service';
import { MarketsServiceMock } from '../../services/markets/markets.service.mock';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { AprTooltipComponent } from './apr-tooltip.component';

describe('AprTooltipComponent', async () => {
    let fixture: ComponentFixture<AprTooltipComponent>;
    let component: AprTooltipComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AprTooltipComponent],
                imports: [FormatValuePipeModule],
                providers: [
                    {
                        provide: MarketsService,
                        useClass: MarketsServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AprTooltipComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
