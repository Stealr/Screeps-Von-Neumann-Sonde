import FactorySystem from './system.Factory';
import CheckCreepsSystem from './system.CheckCreeps';
import CreepsSystem from './system.Creeps';
import ScannerSystem from './system.Scanner';
import MemoryManager from './memory.Manage';
import BuildingSystem from './system.Building';
import Logger from './Logger';

class RoomCore {
    room: Room;
    spawn: StructureSpawn[];
    memory: MemoryManager;

    systems = [CheckCreepsSystem, FactorySystem];

    constructor(room: Room) {
        this.room = room;
        this.spawn = this.room.find(FIND_MY_SPAWNS);
        this.memory = new MemoryManager(this.room.name);
    }

    run() {
        //! тут нужно за каждый спавн подсчитывать доход

        let scanner = new ScannerSystem(this.room.name, this.memory);
        const scannedData = scanner.scanEnergy();

        this.memory.initMemRoom(scannedData);

        let factory = new FactorySystem(this.room.name, this.memory);
        factory.run();

        let checker = new CheckCreepsSystem(this.room.name, factory, this.memory);
        checker.run();

        let creeps = new CreepsSystem(this.room.name, this.memory);
        creeps.run();

        let building = new BuildingSystem(this.room.name, this.spawn[0], this.memory);
        building.firstStageBuilding();

        const logger = new Logger(this.room.name, this.memory);
        logger.run();

        // for (let i = 0; i < systems.length; i++) {
        //     let sys = new systems[i];
        //     sys.run();
        // }
    }
}

export default RoomCore;
