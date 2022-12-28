import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionLoadingComponent } from './position-loading.component';

describe('PositionLoadingComponent', () => {
    let component: PositionLoadingComponent;
    let fixture: ComponentFixture<PositionLoadingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PositionLoadingComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PositionLoadingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
