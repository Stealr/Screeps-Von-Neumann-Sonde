let roles = {
    harvester: (creep, spawn) => {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        
        if (creep.store.getFreeCapacity() > 0) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    },
};

module.exports = roles;
