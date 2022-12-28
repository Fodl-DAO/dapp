import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { IconAssetModule } from '../icon-asset/icon-asset.module';

import { AssetComponent } from './asset.component';

describe('AssetComponent', async () => {
    let fixture: ComponentFixture<AssetComponent>;
    let component: AssetComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AssetComponent],
                imports: [IconAssetModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AssetComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
