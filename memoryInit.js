const memoryInit = {
    init: () => {
        if (Memory.flags?.initiated) return;

        console.log('Инициализация памяти');

        const roomName = Object.keys(Game.rooms)[0];

        Memory.global = {};

        // порядковый номер всех крипов
        Memory.global.creepId = 1;

        // память для комнаты
        Memory.rooms[roomName] = {
            creepId: 1,
            factory: {
                listOrders: [],
            },
        };

        Memory.flags.initiated = true;
    },
};

module.exports = memoryInit;
