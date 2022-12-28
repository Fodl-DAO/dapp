import { TestBed } from '@angular/core/testing';

import { RoutingStateService } from './routing-state.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoutingStateService', () => {
    let service: RoutingStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([])],
        });
        service = TestBed.inject(RoutingStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
