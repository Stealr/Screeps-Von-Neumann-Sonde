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
            factory: {
                listTasks: [],
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
