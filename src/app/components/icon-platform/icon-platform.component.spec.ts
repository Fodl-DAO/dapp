import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { IconPlatformComponent } from './icon-platform.component';

describe('IconPlatformComponent', async () => {
    let fixture: ComponentFixture<IconPlatformComponent>;
    let component: IconPlatformComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [IconPlatformComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(IconPlatformComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
