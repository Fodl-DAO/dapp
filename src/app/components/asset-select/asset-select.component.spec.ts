import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { IconAssetModule } from '../icon-asset/icon-asset.module';

import { AssetSelectComponent } from './asset-select.component';

describe('AssetSelectComponent', async () => {
    let fixture: ComponentFixture<AssetSelectComponent>;
    let component: AssetSelectComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AssetSelectComponent],
                imports: [
                    HttpClientTestingModule,
                    FormsModule,
                    MatSelectModule,
                    FormatValuePipeModule,
                    IconAssetModule,
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AssetSelectComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
