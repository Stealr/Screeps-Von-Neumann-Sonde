/**
 * Канон приоритетов складов (VISION).
 * Чистые константы — без Game API.
 */

export type StorageTag = 'FS' | 'TS' | 'SLC';

/** Harvester deposit: TS → иначе FS */
export const HARVESTER_DEPOSIT_PRIORITY: readonly StorageTag[] = ['TS', 'FS'];

/** Builder / upgrader withdraw: SLC → TS → FS */
export const WITHDRAW_PRIORITY: readonly StorageTag[] = ['SLC', 'TS', 'FS'];

/** Carrier: забрать из TS, везти в SLC / FS */
export const CARRIER_SOURCE_PRIORITY: readonly StorageTag[] = ['TS'];
export const CARRIER_DEST_PRIORITY: readonly StorageTag[] = ['SLC', 'FS'];
