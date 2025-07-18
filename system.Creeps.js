const roles = require('roles.Creeps');

class CreepsSystem {
    constructor(roomName) {
        this.roomName = roomName;
        this.spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);

        this.creepsHarvester = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === 'harvester'
        );
        this.creepsCarrier = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === 'carrier'
        );

        this.creepsBuilder = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === 'builder'
        );
    }

    run() {
        for (const creep of this.creepsHarvester) {
            const releaseSource = (idSource) => {
                Memory.rooms[this.roomName].resources.energySources[idSource].current -= 1;
            };

            const closestSource = this.findClosestSource(creep);
            const storage = this.findStorage();

            if (closestSource && storage) {
                if (!creep.memory.target) {
                    creep.memory.target = closestSource.id;
                    Memory.rooms[this.roomName].resources.energySources[
                        closestSource.id
                    ].current += 1;
                }

                roles.harvester(creep, storage, releaseSource);
            }
        }
    }

    findClosestSource(creep) {
        const energyList = Memory.rooms[this.roomName].resources.energySources;

        const actualSources = Game.rooms[this.roomName].find(FIND_SOURCES);

        const availableSources = actualSources.filter((source) => {
            const sourceData = energyList[source.id];
            return sourceData && sourceData.current < sourceData.max;
        });

        let closestSource = null;
        if (availableSources.length > 0) {
            closestSource = creep.pos.findClosestByRange(availableSources);
        }

        return closestSource;
    }

    findStorage() {
        const listStorage = Memory.rooms[this.roomName].storages;

        let storageTarget = null;
        if (listStorage.TS.length > 0) {
            storageTarget = null;
        } else {
            storageTarget =
                Game.spawns[
                    listStorage.FS.find((storage) => {
                        return Game.spawns[storage].store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    })
                ];
        }

        return storageTarget;
    }
}

module.exports = CreepsSystem;
