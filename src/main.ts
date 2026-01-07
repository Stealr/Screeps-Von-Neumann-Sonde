import MemoryManager from './memory.Manage';
import RoomCore from './RoomCore';

export function loop(): void {
    const memory = new MemoryManager(null);

    memory.initMemGame();
    memory.clear();
    memory.incrementGlobalTick();

    //! тут добавлять profit раз в 1сек за счет каждого спавна

    // const room = Object.entries(Game.rooms)
    // console.log(Object.entries(room[0][1]));
    const newRoom = new RoomCore(Object.values(Game.rooms)[0]);
    newRoom.test();

    // for (const name in Game.creeps) {
    //     const creep = Game.creeps[name];
    //     roleHarvester.run(creep, spawn);
    // }

    // console.log(spawn)
};

class Core {
    constructor() {
        // this.spawn = Game.spawns['Home'];
    }

    startRoomCores() {
        // тут запуск ядер комнат
    }
}
