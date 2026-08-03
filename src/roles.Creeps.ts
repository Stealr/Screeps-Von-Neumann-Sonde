import MemoryManager from './memory.Manage';

type storageType = StructureSpawn | StructureStorage | StructureContainer | null;

type RolesTypes = {
    harvester: (
        creep: Creep,
        storage: storageType,
        releaseSource: (idSource: string) => void,
        memory: MemoryManager
    ) => void;
    builder: (
        creep: Creep,
        target: ConstructionSite<BuildableStructureConstant>,
        replenishment: storageType,
        memory: MemoryManager
    ) => void;
    carrier: () => void;
    upgrader: (creep: Creep, replenishment: storageType) => void;
};

const roles: RolesTypes = {
    /**
     * @param {any} creep // executor
     * @param {any} storage // storage
     * @param {() => void} // callback function
     */
    harvester: (creep, storage, releaseSource, memory) => {
        if (creep.store.getFreeCapacity() > 0 && creep.memory.target) {
            const source = Game.getObjectById(creep.memory.target) as Source | null;
            if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            if (creep.memory.target) {
                releaseSource(creep.memory.target);
                creep.memory.target = null;
            }

            //! написать логику, если не найден свободный storage
            if (storage) {
                const amount = Math.min(
                    creep.store.getUsedCapacity(RESOURCE_ENERGY),
                    storage.store.getFreeCapacity(RESOURCE_ENERGY)
                );
                const transferResult = creep.transfer(storage, RESOURCE_ENERGY);
                if (transferResult === OK) {
                    memory.addProfit(amount);
                } else if (transferResult === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
    },

    /**
     * @param {object} creep // executor
     * @param {object} target // target for build
     * @param {object} replenishment // energy replenishment storage
     */
    builder: (creep, target, replenishment, memory) => {
        const buildResult = creep.build(target);

        if (buildResult === ERR_NOT_ENOUGH_RESOURCES) {
            //! написать логику, если не найден replenishment
            if (replenishment) {
                const amount = creep.store.getFreeCapacity(); 
                const withdrawResult = creep.withdraw(replenishment, RESOURCE_ENERGY, amount);

                if (withdrawResult === OK) {
                    console.log(`Builder withdrew ${amount} energy test`);
                    memory.addExpense(amount);
                } else if (withdrawResult === ERR_NOT_IN_RANGE) {
                    creep.moveTo(replenishment);
                }
            }
        } else if (buildResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },

    carrier: () => {},

    upgrader: (creep, replenishment) => {
        if (!creep.room.controller) return;

        const upgraderResults = creep.upgradeController(creep.room.controller);

        if (upgraderResults === ERR_NOT_ENOUGH_RESOURCES) {
            if (
                replenishment &&
                creep.withdraw(replenishment, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
            ) {
                creep.moveTo(replenishment);
            }
        } else if (upgraderResults === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    },
};

export default roles;
