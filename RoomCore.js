const FactorySystem = require('system.Factory');
const CheckCreepsSystem = require('system.CheckCreeps');
const CreepsSystem = require('system.Creeps');

const systems = [CheckCreepsSystem, FactorySystem];

class RoomCore {
    constructor(room) {
        this.room = room;
        this.spawn = this.room.find(FIND_MY_SPAWNS);
    }

    test() {
        let factory = new FactorySystem(this.room.name);
        factory.run();


        let checker = new CheckCreepsSystem(this.room.name, factory);
        checker.run();

        let creeps = new CreepsSystem(this.room.name);
        creeps.run();


        // for (let i = 0; i < systems.length; i++) {
        //     let sys = new systems[i];
        //     sys.run();
        // }
    }
}

module.exports = RoomCore;
