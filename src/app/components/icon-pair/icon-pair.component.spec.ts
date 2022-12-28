import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { IconAssetModule } from '../icon-asset/icon-asset.module';

import { IconPairComponent } from './icon-pair.component';

describe('IconPairComponent', async () => {
    let fixture: ComponentFixture<IconPairComponent>;
    let component: IconPairComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [IconPairComponent],
                imports: [IconAssetModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(IconPairComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
