const memoryInit = {
    init: () => {
        if (Memory.flags?.initiated) return;

        console.log('Инициализация памяти');

        const roomName = Object.keys(Game.rooms)[0];

        Memory.global = {};

        // порядковый номер всех крипов
        Memory.global.creepId = 0;

        // память для комнаты
        Memory.rooms[roomName] = {
            creepId: 0,
            //! баг если поменять кол-во во время выполнения, то завод застрянет и перестанет выполнять список задач
            reqCreeps: { harvester: 7, builder: 4, carrier: 0 }, // необходимые крипы
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
        };

        Memory.flags.initiated = true;
    },

    clear: () => {
        const listCreeps = Memory.creeps;

        for (const name in listCreeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }
    },
};

module.exports = memoryInit;
