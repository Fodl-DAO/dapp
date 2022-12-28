import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { BorrowLimitBarComponent } from './borrow-limit-bar.component';

describe('BorrowLimitBarComponent', async () => {
    let fixture: ComponentFixture<BorrowLimitBarComponent>;
    let component: BorrowLimitBarComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [BorrowLimitBarComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(BorrowLimitBarComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
