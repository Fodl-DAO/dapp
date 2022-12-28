import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { EthereumService } from '../../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../../services/ethereum/ethereum.service.mock';

import { WalletDialogComponent } from './wallet-dialog.component';

describe('WalletDialogComponent', () => {
    let component: WalletDialogComponent;
    let fixture: ComponentFixture<WalletDialogComponent>;

    const buttonSelector = '.mat-stroked-button .mat-button-wrapper';
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WalletDialogComponent],
            imports: [
                CommonModule,
                MatButtonModule,
                MatDialogModule,
                MatIconModule,
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: EthereumService, useClass: EthereumServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WalletDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
