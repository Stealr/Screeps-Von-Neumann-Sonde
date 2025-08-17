class MemoryManager {
    constructor(roomName) {
        this.roomName = roomName;
    }

    // --- INIT ---
    initMemGame() {
        if (Memory.flags?.initiatedMem) return;

        console.log('Инициализация памяти игры');

        // порядковый номер всех крипов
        Memory.global = {
            creepId: 0,
        };

        Memory.flags.initiatedMem = true;
    }

    initMemRoom(scannedData) {
        if (Memory.rooms[this.roomName]?.flags?.initiatedMem) return;

        console.log('Инициализация памяти комнаты');

        // память для комнаты
        Memory.rooms[this.roomName] = {
            creepId: 0,
            //! баг если поменять кол-во во время выполнения, то завод застрянет и перестанет выполнять список задач
            reqCreeps: {
                harvester: scannedData.TotalAvailableCells,
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
                FS: [Object.keys(Game.spawns)[0]],
            },
            resources: {
                energySources: { ...scannedData.availableCells },
            },
            flags: {
                initiatedMem: true,
                scanned: true,
            },
        };
    }

    // --- CREEPS ---
    getRequiredCreeps() {
        return Memory.rooms[this.roomName]?.reqCreeps;
    }

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

    occupyEnergySources(idSource) {
        Memory.rooms[this.roomName].resources.energySources[idSource].current += 1;
    }

    releaseEnergySources(idSource) {
        Memory.rooms[this.roomName].resources.energySources[idSource].current -= 1;
    }

    getStorageList() {
        return Memory.rooms[this.roomName].storages;
    }

    // --- Factory ---
    getFactoryTasks() {
        return Memory.rooms[this.roomName]?.factory.listTasks;
    }

    addTask(task) {
        Memory.rooms[this.roomName].factory.listTasks.push(task);
    }

    addTasks(tasks) {
        Memory.rooms[this.roomName].factory.listTasks.push(...tasks);
    }

    removeFirstTask() {
        return Memory.rooms[this.roomName].factory.listTasks.shift();
    }

    // --- Resources ---
    getEnergySources() {
        return Memory.rooms[this.roomName]?.resources.energySources;
    }

    updateEnergySource(sourceId, current) {
        if (Memory.rooms[this.roomName]?.resources.energySources[sourceId]) {
            Memory.rooms[this.roomName].resources.energySources[sourceId].current = current;
        }
    }

    // another
    getScannedFlag() {
        return Memory.rooms[this.roomName]?.flags?.scanned
    }

    clear() {
        const listCreeps = Memory.creeps;

        for (const name in listCreeps) {
            if (!(name in Game.creeps)) {
                const deadCreepMemory = Memory.creeps[name];

                // освобождение источника, если harvester умер
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

module.exports = MemoryManager;
