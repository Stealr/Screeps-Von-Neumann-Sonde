import { describe, expect, it } from 'vitest';
import {
    calcCreepLack,
    cancelTasksFromQueue,
    syncTaskActions,
} from '../src/logic.creeps';

describe('calcCreepLack', () => {
    it('считает lack = req - alive - expected', () => {
        expect(calcCreepLack(5, 2, 1)).toBe(2);
        expect(calcCreepLack(3, 3, 0)).toBe(0);
        expect(calcCreepLack(2, 3, 1)).toBe(-2);
    });
});

describe('syncTaskActions', () => {
    it('при lack > 0 планирует create', () => {
        expect(syncTaskActions(3)).toEqual({ create: 3, cancel: 0 });
    });

    it('при lack < 0 планирует cancel', () => {
        expect(syncTaskActions(-2)).toEqual({ create: 0, cancel: 2 });
    });

    it('при lack = 0 ничего не делает', () => {
        expect(syncTaskActions(0)).toEqual({ create: 0, cancel: 0 });
    });
});

describe('cancelTasksFromQueue', () => {
    it('снимает лишние задачи роли с хвоста очереди', () => {
        const queue = [
            { id: '1', name: 'harvester' },
            { id: '2', name: 'builder' },
            { id: '3', name: 'harvester' },
            { id: '4', name: 'harvester' },
        ];

        const next = cancelTasksFromQueue(queue, 'harvester', 2);

        expect(next.map((t) => t.id)).toEqual(['1', '2']);
        // исходная очередь не мутируется
        expect(queue).toHaveLength(4);
    });

    it('не трогает чужие роли и не уходит в минус', () => {
        const queue = [
            { id: '1', name: 'builder' },
            { id: '2', name: 'harvester' },
        ];

        expect(cancelTasksFromQueue(queue, 'builder', 5).map((t) => t.id)).toEqual(['2']);
    });
});
