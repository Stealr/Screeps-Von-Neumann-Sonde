const roles = require('roles.Creeps');

class CreepsSystem {
    constructor(roomName) {
        this.roomName = roomName;
        this.spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);

        this.creepsHarvester = Object.values(Game.creeps).filter(
            (creep) => creep.memory.role === 'harvester'
        );
        // this.creepsCarrier = Object.values(Game.creeps).filter(
        //     (creep) => creep.memory.role === 'carrier'
        // );

        // this.creepsBuilder = Object.values(Game.creeps).filter(
        //     (creep) => creep.memory.role === 'builder'
        // );

        this.allCreeps = { harvester: this.creepsHarvester };
    }

    run() {
        for (const roleIndex in this.allCreeps) {
            for (const creepIndex in this.allCreeps[roleIndex]) {
                const creep = this.allCreeps[roleIndex][creepIndex];
                roles[roleIndex](creep, this.spawns[0]);
            }
        }
        // console.log(this.creepsHarvester);
    }
}

module.exports = CreepsSystem;
