const MemoryManager = require('memory.Manage');

class BuildingSystem {
    constructor(roomName, spawn) {
        this.roomName = roomName;
        this.spawn = spawn;
        this.memory = new MemoryManager(this.roomName);
    }

    firstStageBuilding() {
        if (this.memory.getFirstStageBuildingFlag()) return

        const spawnX = this.spawn.pos.x;
        const spawnY = this.spawn.pos.y;

        //! добавить до upgrader, вокруг spawn
        //! также нужно решить куда ставить extantions

        // строительство до sources
        //! баг дорога строится в ресурсе
        const sources = Object.keys(this.memory.getEnergySources());
        for (const sourceId of sources) {
            const source = Game.getObjectById(sourceId);

            const path = this.spawn.pos.findPathTo(source, {
                ignoreCreeps: true,
                swampCost: 1,
            });

            const correctPath = path.slice(0, path.length - 1)

            for (const pos of correctPath) {
                const room = Game.rooms[this.roomName];
                const resultBuildRoad = room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            }
        }

        this.memory.setFirstStageBuildingFlag();
    }
}

module.exports = BuildingSystem;
