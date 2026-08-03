import MemoryManager from './memory.Manage';

class BuildingSystem {
    roomName: string;
    spawn: StructureSpawn;
    memory: MemoryManager;

    constructor(roomName: string, spawn: StructureSpawn, memory: MemoryManager) {
        this.roomName = roomName;
        this.spawn = spawn;
        this.memory = memory;
    }

    firstStageBuilding() {
        if (this.memory.getFirstStageBuildingFlag()) return;

        //! добавить до upgrader, вокруг spawn
        //! также нужно решить куда ставить extantions

        // строительство до sources
        const sources = Game.rooms[this.roomName].find(FIND_SOURCES);
        for (const source of sources) {
            const path = this.spawn.pos.findPathTo(source, {
                ignoreCreeps: true,
                swampCost: 1,
            });

            for (const pos of path) {
                // не ставить construction site на клетку source
                if (pos.x === source.pos.x && pos.y === source.pos.y) continue;

                const room = Game.rooms[this.roomName];
                room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            }
        }

        this.memory.setFirstStageBuildingFlag();
    }
}

export default BuildingSystem;
