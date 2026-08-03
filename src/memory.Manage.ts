import { ScannedData } from './system.Scanner';

class MemoryManager {
    roomName: string;

    constructor(roomName: string) {
        this.roomName = roomName;
    }

    // --- INIT ---
    initMemGame() {
        if (Memory.flags?.initiatedMem) return;

        console.log('Инициализация памяти игры');

        // порядковый номер всех крипов
        Memory.global = {
            creepId: 0,
            tick: 0,
            stats: {
                energy: {
                    totalProfit: [],
                    totalExpense: [],
                },
            },
        };

        Memory.flags.initiatedMem = true;
    }

    initMemRoom(scannedData: ScannedData | undefined) {
        if (Memory.rooms[this.roomName]?.flags?.initiatedMem) return;

        console.log('Инициализация памяти комнаты');

        // память для комнаты
        Memory.rooms[this.roomName] = {
            creepId: 0,
            //! баг если поменять кол-во во время выполнения, то завод застрянет и перестанет выполнять список задач
            reqCreeps: {
                harvester: scannedData?.TotalAvailableCells ?? 0,
                builder: 1,
                upgrader: 0,
                carrier: 0,
            }, // необходимые крипы
            factory: {
                listTasks: [],
            },
            // складская система, хранятся ключи к объектам
            storages: {
                SLC: [],
                TS: [],
                FS: [Object.values(Game.spawns)[0].id as Id<StructureSpawn>],
            },
            resources: {
                energySources: { ...scannedData?.availableCells },
            },
            stats: {
                energy: {
                    profit: [],
                    expense: [],
                },
            },
            flags: {
                initiatedMem: true,
                scanned: true,
            },
        };
    }

    // --- GLOBAL ---
    incrementGlobalTick() {
        Memory.global.tick += 1;
    }

    // --- Stats ---
    addProfit(amount: number) {
        const roomProfit = Memory.rooms[this.roomName].stats.energy.profit;
        roomProfit.push({ amount, tick: Game.time });
        Memory.rooms[this.roomName].stats.energy.profit = roomProfit.filter(
            (event) => event.tick >= Game.time - 60
        );

        const globalProfit = Memory.global.stats.energy.totalProfit;
        globalProfit.push({ amount, tick: Game.time });
        Memory.global.stats.energy.totalProfit = globalProfit.filter((event) => event.tick >= Game.time - 60);
    }

    addExpense(amount: number) {
        const roomExpense = Memory.rooms[this.roomName].stats.energy.expense;
        roomExpense.push({ amount, tick: Game.time });
        Memory.rooms[this.roomName].stats.energy.expense = roomExpense.filter(
            (event) => event.tick >= Game.time - 60
        );

        const globalExpense = Memory.global.stats.energy.totalExpense;
        globalExpense.push({ amount, tick: Game.time });
        Memory.global.stats.energy.totalExpense = globalExpense.filter((event) => event.tick >= Game.time - 60);
    }

    getRoomEnergyStats() {
        return Memory.rooms[this.roomName].stats.energy;
    }

    getGlobalEnergyStats() {
        return Memory.global.stats.energy;
    }

    // --- CREEPS ---
    /**
     * @description Возвращает объект с количеством требуемых крипов для комнаты.
     * @returns {object | undefined} Объект с требуемым количеством крипов по ролям или undefined, если память комнаты не инициализирована.
     */
    getRequiredCreeps() {
        return Memory.rooms[this.roomName]?.reqCreeps;
    }

    /**
     * @description Возвращает текущее значение счетчика ID крипов для комнаты.
     * @returns {number | undefined} Локальный ID крипа или undefined, если память не найдена.
     */
    getCreepIdCounter() {
        return Memory.rooms[this.roomName]?.creepId;
    }

    getGlobalCreepIdCounter() {
        return Memory.global.creepId;
    }

    incrementCreepIdCounter() {
        Memory.rooms[this.roomName].creepId += 1;
        Memory.global.creepId += 1;
    }

    // --- Storage ---
    getStorageList() {
        return Memory.rooms[this.roomName].storages;
    }

    // --- Factory ---
    /**
     * @returns Возвращает ссылку на listTasks в памяти комнаты
     */
    getFactoryTasks() {
        return Memory.rooms[this.roomName]?.factory.listTasks;
    }

    // --- Resources ---
    getEnergySources() {
        return Memory.rooms[this.roomName]?.resources.energySources;
    }

    occupyEnergySources(idSource: string) {
        Memory.rooms[this.roomName].resources.energySources[idSource].current += 1;
    }

    releaseEnergySources(idSource: string) {
        Memory.rooms[this.roomName].resources.energySources[idSource].current -= 1;
    }

    // --- building ---
    setFirstStageBuildingFlag() {
        Memory.rooms[this.roomName].flags.firstStageBuilding = true;
    }

    getFirstStageBuildingFlag() {
        return Memory.rooms[this.roomName]?.flags?.firstStageBuilding;
    }

    // another
    getScannedFlag() {
        return Memory.rooms[this.roomName]?.flags?.scanned;
    }

    clear() {
        const listCreeps = Memory.creeps;

        for (const name in listCreeps) {
            if (!(name in Game.creeps)) {
                const deadCreepMemory = Memory.creeps[name];

                // release source if creep is dead
                if (deadCreepMemory.role === 'harvester' && deadCreepMemory.target) {
                    const roomName = deadCreepMemory.home;
                    const sourceId = deadCreepMemory.target;

                    if (
                        Memory.rooms[roomName] &&
                        Memory.rooms[roomName].resources.energySources[sourceId]
                    ) {
                        Memory.rooms[roomName].resources.energySources[sourceId].current -= 1;
                    }
                }

                delete Memory.creeps[name];
            }
        }
    }
}

export default MemoryManager;
