// const FactorySystem = require('system.Factory');
// const CheckCreepsSystem = require('system.CheckCreeps');
// const CreepsSystem = require('system.Creeps');
// const ScannerSystem = require('system.Scanner');
// const BuildingSystem = require('system.Building');
// const MemoryManager = require('memory.Manage');

import FactorySystem from './system.Factory';
import CheckCreepsSystem from './system.CheckCreeps';
import CreepsSystem from './system.Creeps';
import ScannerSystem from './system.Scanner';
import MemoryManager from './memory.Manage';
import BuildingSystem from './system.Building';

class RoomCore {
    systems = [CheckCreepsSystem, FactorySystem];

    constructor(room) {
        this.room = room;
        this.spawn = this.room.find(FIND_MY_SPAWNS);
        this.memory = new MemoryManager(this.room.name);
    }

    test() {
        let scanner = new ScannerSystem(this.room.name);
        const scannedData = scanner.scanEnergy();

        this.memory.initMemRoom(scannedData);

        let factory = new FactorySystem(this.room.name);
        factory.run();

        let checker = new CheckCreepsSystem(this.room.name, factory);
        checker.run();

        let creeps = new CreepsSystem(this.room.name);
        creeps.run();

        let building = new BuildingSystem(this.room.name, this.spawn[0]);
        building.firstStageBuilding();

        // for (let i = 0; i < systems.length; i++) {
        //     let sys = new systems[i];
        //     sys.run();
        // }
    }
}

export default RoomCore;
