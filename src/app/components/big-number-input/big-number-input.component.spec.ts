import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigNumberInputComponent } from './big-number-input.component';

describe('BigNumberInputComponent', () => {
    let component: BigNumberInputComponent;
    let fixture: ComponentFixture<BigNumberInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BigNumberInputComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BigNumberInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
