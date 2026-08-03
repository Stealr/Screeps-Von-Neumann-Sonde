import roles from './roles.Creeps';
import MemoryManager from './memory.Manage';

class CreepsSystem {
    roomName: string;
    memory: MemoryManager;
    spawns: StructureSpawn[];

    creepsHarvester: Creep[];
    creepsCarrier: Creep[];
    creepsBuilder: Creep[];
    creepsUpgraders: Creep[];

    constructor(roomName: string, memory: MemoryManager) {
        this.roomName = roomName;
        this.memory = memory;
        this.spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);

        const roomCreeps = Object.values(Game.creeps).filter(
            (creep) => creep.memory.home === this.roomName
        );

        this.creepsHarvester = roomCreeps.filter((creep) => creep.memory.role === 'harvester');
        this.creepsCarrier = roomCreeps.filter((creep) => creep.memory.role === 'carrier');
        this.creepsBuilder = roomCreeps.filter((creep) => creep.memory.role === 'builder');
        this.creepsUpgraders = roomCreeps.filter((creep) => creep.memory.role === 'upgrader');
    }

    run() {
        this.harvesterCycleLife();
        this.builderCycleLife();
        this.upgraderCycleLife();
    }

    harvesterCycleLife() {
        const storage = this.findStorage('FS', 'transfer');

        for (const creep of this.creepsHarvester) {
            const releaseSource = (idSource: string) => {
                this.memory.releaseEnergySources(idSource);
            };

            const closestSource = this.findClosestSource(creep);
            if (closestSource || creep.memory.target) {
                if (!creep.memory.target && closestSource) {
                    creep.memory.target = closestSource.id;
                    this.memory.occupyEnergySources(closestSource.id);
                }

                roles.harvester(creep, storage, releaseSource, this.memory);
            }
        }
    }

    builderCycleLife() {
        for (const creep of this.creepsBuilder) {
            // цель для строительства
            const target = Game.rooms[this.roomName].find(FIND_CONSTRUCTION_SITES)[0];

            // склад для пополнения припасов
            let replenishment = null;
            if (this.findStorage('TS', 'withdraw')) {
                console.log('Take from TS');
            } else if (this.findStorage('SLC', 'withdraw')) {
                console.log('Take from SLC');
            } else {
                replenishment = this.findStorage('FS', 'withdraw');
                // replenishment =
                //     Game.spawns[
                //         listStorage.FS.find((storage) => {
                //             return Game.spawns[storage].store.getUsedCapacity(RESOURCE_ENERGY) > 10;
                //         })
                //     ];
            }

            if (target) {
                roles.builder(creep, target, replenishment, this.memory);
            }
        }
    }

    upgraderCycleLife() {
        for (const creep of this.creepsUpgraders) {
            // склад для пополнения припасов
            let replenishment = null;
            if (this.findStorage('SLC', 'withdraw')) {
                console.log('Take from SLC');
            } else if (this.findStorage('TS', 'withdraw')) {
                console.log('Take from TS');
            } else {
                replenishment = this.findStorage('FS', 'withdraw');
                // replenishment =
                //     Game.spawns[
                //         listStorage.FS.find((storage) => {
                //             return Game.spawns[storage].store.getUsedCapacity(RESOURCE_ENERGY) > 10;
                //         })
                //     ];
            }

            roles.upgrader(creep, replenishment);
        }
    }

    findClosestSource(creep: Creep) {
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

    findStorage(typeStorage: 'TS' | 'SLC' | 'FS', goal: 'withdraw' | 'transfer') {
        const listStorage = this.memory.getStorageList();

        //! Ищет не ближайший, а первый попавшийся
        let storageObj = null;
        if (goal === 'withdraw') {
            storageObj = listStorage[typeStorage].find((id) => {
                const storage = Game.getObjectById(id);
                return storage ? storage?.store.getUsedCapacity(RESOURCE_ENERGY) > 10 : null;
            });
        } else {
            storageObj = listStorage[typeStorage].find((id) => {
                const storage = Game.getObjectById(id);
                return storage ? storage?.store.getFreeCapacity(RESOURCE_ENERGY) > 0 : null;
            });
        }

        return storageObj ? Game.getObjectById(storageObj) : null;
    }
}

export default CreepsSystem;
