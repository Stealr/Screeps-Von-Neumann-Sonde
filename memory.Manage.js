const memoryInit = {
    initMemGame: () => {
        if (Memory.flags?.initiatedMem) return;

        console.log('Инициализация памяти игры');

        // порядковый номер всех крипов
        Memory.global = {
            creepId: 0,
        };

        Memory.flags.initiatedMem = true;
    },

    initMemRoom: (roomName) => {
        if (Memory.rooms[roomName]?.flags?.initiatedMem) return;

        console.log('Инициализация памяти комнаты');

        // память для комнаты
        Memory.rooms[roomName] = {
            creepId: 0,
            //! баг если поменять кол-во во время выполнения, то завод застрянет и перестанет выполнять список задач
            reqCreeps: { harvester: 2, builder: 1, carrier: 0, upgrader: 2 }, // необходимые крипы
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
                energySources: {},
            },
            flags: {
                initiatedMem: true,
            },
        };
    },

    clear: () => {
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
    },
};

module.exports = memoryInit;
