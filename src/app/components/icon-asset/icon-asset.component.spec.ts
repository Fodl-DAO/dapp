import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { IconPlatformModule } from '../icon-platform/icon-platform.module';

import { IconAssetComponent } from './icon-asset.component';

describe('IconAssetComponent', async () => {
    let fixture: ComponentFixture<IconAssetComponent>;
    let component: IconAssetComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [IconAssetComponent],
                imports: [IconPlatformModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(IconAssetComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
