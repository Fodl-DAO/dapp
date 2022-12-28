import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EthereumService } from '../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../services/ethereum/ethereum.service.mock';

import { WalletDialogModule } from './wallet-dialog/wallet-dialog.module';

import { WalletComponent } from './wallet.component';

describe('WalletComponent', async () => {
    let fixture: ComponentFixture<WalletComponent>;
    let component: WalletComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [
                    MatButtonModule,
                    MatIconModule,
                    MatTooltipModule,
                    WalletDialogModule,
                ],
                declarations: [WalletComponent],
                providers: [
                    {
                        provide: EthereumService,
                        useClass: EthereumServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(WalletComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should not have any accounts by default', () => {
        expect(component.ethereumService.getAccount()).toBeFalsy();
    });
});
