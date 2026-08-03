import { describe, expect, it } from 'vitest';
import {
    CARRIER_DEST_PRIORITY,
    CARRIER_SOURCE_PRIORITY,
    HARVESTER_DEPOSIT_PRIORITY,
    WITHDRAW_PRIORITY,
} from '../src/logic.storage';

describe('storage priorities (VISION canon)', () => {
    it('harvester deposit: TS → FS', () => {
        expect(HARVESTER_DEPOSIT_PRIORITY).toEqual(['TS', 'FS']);
    });

    it('builder/upgrader withdraw: SLC → TS → FS', () => {
        expect(WITHDRAW_PRIORITY).toEqual(['SLC', 'TS', 'FS']);
    });

    it('carrier: from TS to SLC/FS', () => {
        expect(CARRIER_SOURCE_PRIORITY).toEqual(['TS']);
        expect(CARRIER_DEST_PRIORITY).toEqual(['SLC', 'FS']);
    });
});
