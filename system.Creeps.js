const roles = require('roles.Creeps');
const MemoryManager = require('memory.Manage');

class CreepsSystem {
    constructor(roomName) {
        this.roomName = roomName;
        this.memory = new MemoryManager(this.roomName);
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
        this.creepsUpgraders = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === 'upgrader'
        );
    }

    run() {
        this.harvesterCycleLife();
        this.builderCycleLife();
        this.upgraderCycleLife();
    }

    harvesterCycleLife() {
        const storage = this.findStorage();

        for (const creep of this.creepsHarvester) {
            const releaseSource = (idSource) => {
                this.memory.releaseEnergySources(idSource);
            };

            const closestSource = this.findClosestSource(creep);
            if (closestSource || creep.memory.target) {
                if (!creep.memory.target) {
                    creep.memory.target = closestSource.id;
                    this.memory.occupyEnergySources(closestSource.id);
                }

                roles.harvester(creep, storage, releaseSource);
            }
        }
    }

    builderCycleLife() {
        const listStorage = this.memory.getStorageList()

        for (const creep of this.creepsBuilder) {
            // цель для строительства
            const target = Game.rooms[this.roomName].find(FIND_CONSTRUCTION_SITES)[0];

            // склад для пополнения припасов
            let replenishment;
            if (listStorage.TS.length > 0) {
                console.log('Take from TS');
            } else if (listStorage.SLC.length > 0) {
                console.log('Take from SLC');
            } else {
                replenishment =
                    Game.spawns[
                        listStorage.FS.find((storage) => {
                            return Game.spawns[storage].store.getUsedCapacity(RESOURCE_ENERGY) > 10;
                        })
                    ];
            }

            if (target) {
                roles.builder(creep, target, replenishment);
            }
        }
    }

    upgraderCycleLife() {
        const listStorage = this.memory.getStorageList()

        for (const creep of this.creepsUpgraders) {
            // склад для пополнения припасов
            let replenishment;
            if (listStorage.SLC.length > 0) {
                console.log('Take from SLC');
            } else if (listStorage.TS.length > 0) {
                console.log('Take from TS');
            } else {
                replenishment =
                    Game.spawns[
                        listStorage.FS.find((storage) => {
                            return Game.spawns[storage].store.getUsedCapacity(RESOURCE_ENERGY) > 10;
                        })
                    ];
            }

            roles.upgrader(creep, replenishment);
        }
    }

    findClosestSource(creep) {
        const energyList = this.memory.getEnergySources();

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
        const listStorage = this.memory.getStorageList()

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
