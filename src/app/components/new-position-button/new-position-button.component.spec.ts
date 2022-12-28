import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NewPositionButtonComponent } from './new-position-button.component';

describe('NewPositionButtonComponent', async () => {
    let fixture: ComponentFixture<NewPositionButtonComponent>;
    let component: NewPositionButtonComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [NewPositionButtonComponent],
                imports: [MatButtonModule, MatIconModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(NewPositionButtonComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
