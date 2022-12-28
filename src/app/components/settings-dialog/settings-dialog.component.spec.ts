import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DialogModule } from '../dialog/dialog.module';

import { SettingsDialogComponent } from './settings-dialog.component';

describe('SettingsDialogComponent', async () => {
    let fixture: ComponentFixture<SettingsDialogComponent>;
    let component: SettingsDialogComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SettingsDialogComponent],
                imports: [
                    MatButtonModule,
                    MatDialogModule,
                    MatIconModule,
                    DialogModule,
                ],
                providers: [
                    {
                        provide: MatDialogRef,
                        useValue: {},
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsDialogComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
