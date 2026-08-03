import RoomCore from './RoomCore';

export function loop(): void {
    const room = Object.values(Game.rooms)[0];
    if (!room) return;

    const roomCore = new RoomCore(room);

    roomCore.memory.initMemGame();
    roomCore.memory.clear();
    // roomCore.memory.incrementGlobalTick();

    //! тут добавлять profit раз в 1сек за счет каждого спавна

    roomCore.run();

    // for (const name in Game.creeps) {
    //     const creep = Game.creeps[name];
    //     roleHarvester.run(creep, spawn);
    // }

    // console.log(spawn)
}

class Core {
    constructor() {
        // this.spawn = Game.spawns['Home'];
    }

    startRoomCores() {
        // тут запуск ядер комнат
    }
}
