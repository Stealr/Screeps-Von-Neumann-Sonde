const FactorySystem = require('system.Factory');
const CheckUnitsSystem = require('system.CheckUnits');
const CreepsSystem = require('system.Creeps');

const systems = [CheckUnitsSystem, FactorySystem];

class RoomCore {
    constructor(room) {
        this.room = room;
        this.spawn = this.room.find(FIND_MY_SPAWNS);
    }

    test() {
        // console.log(`room: ${this.room}`, `spawn: ${this.spawn}`)
        console.log();
        console.log('===========================');
        console.log('==== Отчет по системам ====');
        console.log('===========================');

        let factory = new FactorySystem(this.room.name);
        factory.run();


        let checker = new CheckUnitsSystem(factory);
        checker.run();


        // for (let i = 0; i < systems.length; i++) {
        //     let sys = new systems[i];
        //     sys.run();
        // }
        console.log('===========================');
    }
}

module.exports = RoomCore;
