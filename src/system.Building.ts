import MemoryManager from './memory.Manage';

class BuildingSystem {
    roomName: string;
    spawn: StructureSpawn;
    memory: MemoryManager;

    constructor(roomName: string, spawn: StructureSpawn) {
        this.roomName = roomName;
        this.spawn = spawn;
        this.memory = new MemoryManager(this.roomName);
    }

    firstStageBuilding() {
        if (this.memory.getFirstStageBuildingFlag()) return;

        const spawnX = this.spawn.pos.x;
        const spawnY = this.spawn.pos.y;

        //! добавить до upgrader, вокруг spawn
        //! также нужно решить куда ставить extantions

        // строительство до sources
        //! баг дорога строится в ресурсе
        // const sources = Object.keys(this.memory.getEnergySources());
        const sources = Game.rooms[this.roomName].find(FIND_SOURCES);
        for (const source of sources) {
            const path = this.spawn.pos.findPathTo(source, {
                ignoreCreeps: true,
                swampCost: 1,
            });

            const correctPath = path.slice(0, path.length - 1);

            for (const pos of correctPath) {
                const room = Game.rooms[this.roomName];
                const resultBuildRoad = room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            }
        }

        this.memory.setFirstStageBuildingFlag();
    }
}

export default BuildingSystem;
