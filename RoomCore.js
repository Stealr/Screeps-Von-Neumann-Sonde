const FactorySystem = require('system.Factory');
const CheckCreepsSystem = require('system.CheckCreeps');
const CreepsSystem = require('system.Creeps');
const ScannerSystem = require('system.Scanner');
const MemoryManager = require('memory.Manage');

class RoomCore {
    systems = [CheckCreepsSystem, FactorySystem];

    constructor(room) {
        this.room = room;
        this.spawn = this.room.find(FIND_MY_SPAWNS);
        this.memory = new MemoryManager(this.room.name);
    }

    test() {
        let scanner = new ScannerSystem(this.room.name)
        const scannedData = scanner.scanEnergy();

        this.memory.initMemRoom(scannedData);

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
