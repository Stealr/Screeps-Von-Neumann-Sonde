let roles = {
    /**
     * @param {any} creep // executor
     * @param {any} storage // storage
     * @param {() => void} // callback function
     */
    harvester: (creep, storage, releaseSource) => {
        const source = Game.getObjectById(creep.memory.target);

        if (creep.store.getFreeCapacity() > 0) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            if (creep.memory.target) {
                releaseSource(creep.memory.target);
                creep.memory.target = null;
            }

            //! написать логику, если не найден свободный storage
            if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    },

    /**
     * @param {object} creep // executor
     * @param {object} target // target for build
     * @param {object} replenishment // energy replenishment storage
     */
    builder: (creep, target, replenishment) => {
        const buildResult = creep.build(target);

        if (buildResult === ERR_NOT_ENOUGH_RESOURCES) {
            //! написать логику, если не найден replenishment
            if (creep.withdraw(replenishment, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(replenishment);
            }
        } else if (buildResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },

    carrier: () => {},

    upgrader: (creep, replenishment) => {
        const upgraderResults = creep.upgradeController(creep.room.controller);

        if (upgraderResults == ERR_NOT_ENOUGH_RESOURCES) {
            if (creep.withdraw(replenishment, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(replenishment);
            }
        } else if (upgraderResults == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    },
};

module.exports = roles;
