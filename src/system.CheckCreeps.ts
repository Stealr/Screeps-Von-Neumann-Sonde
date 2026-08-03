import MemoryManager from './memory.Manage';
import FactorySystemType from './system.Factory';

class CheckUnitsSystem {
    factory: FactorySystemType;
    roomName: string;
    memory: MemoryManager;

    reqCreeps: RoomMemory['reqCreeps'];
    aliveCreeps: Partial<Record<CreepRoles, number>> = {};
    expectedCreeps: Partial<Record<CreepRoles, number>> = {};

    constructor(roomName: string, FactorySystem: FactorySystemType, memory: MemoryManager) {
        this.factory = FactorySystem;
        this.roomName = roomName;
        this.memory = memory;

        this.reqCreeps = this.memory.getRequiredCreeps(); // кол-во необходимых крипов
        this.aliveCreeps = {}; // живые крипы
        this.expectedCreeps = {}; // ожидаемое пополнение крипов

        this.defineAliveCreeps();
        this.defineExpectedCreeps();
    }

    run() {
        for (const role of Object.keys(this.reqCreeps) as CreepRoles[]) {
            const alive = this.aliveCreeps[role] ?? 0;
            const expected = this.expectedCreeps[role] ?? 0;
            const lack = this.reqCreeps[role] - alive - expected;

            if (lack > 0) {
                this.factory.createTask(Array.from({ length: lack }, () => role));
            } else if (lack < 0) {
                this.factory.cancelTasks(role, -lack);
            }
        }
    }

    /**
     * Description - определяет объект живых крипов по ролям (только home этой комнаты)
     */
    defineAliveCreeps() {
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.home !== this.roomName) continue;

            const role = creep.memory.role;
            this.aliveCreeps[role] = (this.aliveCreeps[role] ?? 0) + 1;
        }
    }

    /**
     * Description - определяет объект ожидаемых крипов по ролям
     */
    defineExpectedCreeps() {
        const listTasks = this.memory.getFactoryTasks();

        for (const order in listTasks) {
            const role = listTasks[order].name;

            this.expectedCreeps[role] = (this.expectedCreeps[role] ?? 0) + 1;
        }
    }
}

export default CheckUnitsSystem;
