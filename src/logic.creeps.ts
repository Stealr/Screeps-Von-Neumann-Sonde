/**
 * Чистая логика численности крипов и синхронизации очереди завода.
 * Без Game API — покрывается unit-тестами.
 */

/** lack = req - alive - expected; >0 создать, <0 отменить */
export function calcCreepLack(req: number, alive: number, expected: number): number {
    return req - alive - expected;
}

export function syncTaskActions(lack: number): { create: number; cancel: number } {
    if (lack > 0) return { create: lack, cancel: 0 };
    if (lack < 0) return { create: 0, cancel: -lack };
    return { create: 0, cancel: 0 };
}

/** Убирает count задач роли с хвоста очереди (раньше в очереди — выше приоритет). */
export function cancelTasksFromQueue<T extends { name: string }>(
    listTasks: T[],
    role: string,
    count: number
): T[] {
    const next = listTasks.slice();
    let remaining = count;

    for (let i = next.length - 1; i >= 0 && remaining > 0; i--) {
        if (next[i].name === role) {
            next.splice(i, 1);
            remaining -= 1;
        }
    }

    return next;
}
