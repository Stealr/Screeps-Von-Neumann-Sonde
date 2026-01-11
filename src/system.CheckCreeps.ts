import MemoryManager from './memory.Manage';
import FactorySystemType from './system.Factory';

class CheckUnitsSystem {
    factory: FactorySystemType;
    roomName: string;
    memory: MemoryManager;

    reqCreeps: RoomMemory['reqCreeps'];
    aliveCreeps: Partial<Record<CreepRoles, number>> = {};
    expectedCreeps: Partial<Record<CreepRoles, number>> = {};

    reqNum: number;

    constructor(roomName: string, FactorySystem: FactorySystemType) {
        this.factory = FactorySystem;
        this.roomName = roomName;
        this.memory = new MemoryManager(this.roomName);

        this.reqCreeps = this.memory.getRequiredCreeps(); // кол-во необходимых крипов
        this.aliveCreeps = {}; // живые крипы
        this.expectedCreeps = {}; // ожидаемое пополнение крипов

        this.defineAliveCreeps();
        this.defineExpectedCreeps();

        //  количество необходимых крипов
        this.reqNum = Object.values(this.reqCreeps).reduce((acc, cur) => acc + cur, 0);
    }

    run() {
        const countCreeps = Object.keys(Game.creeps).length;

        if (countCreeps != this.reqNum) {
            for (const role of Object.keys(this.reqCreeps) as CreepRoles[]) {
                if (
                    (this.aliveCreeps?.[role] ?? 0) + (this.expectedCreeps?.[role] ?? 0) <
                    this.reqCreeps[role]
                ) {
                    // проверка есть ли живые крипы или ожидаемые поставки
                    const isAliveCreeps = (this.aliveCreeps?.[role] ?? 0) !== 0;
                    const isExpectedCreeps = (this.expectedCreeps?.[role] ?? 0) !== 0;

                    let lackCreeps;
                    if (isAliveCreeps && isExpectedCreeps) {
                        lackCreeps =
                            this.reqCreeps[role] -
                            ((this.expectedCreeps[role] ?? 0) + (this.aliveCreeps[role] ?? 0));
                    } else if (isAliveCreeps === true && isExpectedCreeps === false) {
                        lackCreeps = this.reqCreeps[role] - (this.aliveCreeps[role] ?? 0);
                    } else if (isAliveCreeps === false && isExpectedCreeps && true) {
                        lackCreeps = this.reqCreeps[role] - (this.expectedCreeps[role] ?? 0);
                    } else {
                        lackCreeps = this.reqCreeps[role];
                    }

                    this.factory.createTask(Array.from({ length: lackCreeps }, () => role));
                }
            }
        }
    }

    /**
     * Description - определяет объект живых крипов по ролям
     */
    defineAliveCreeps() {
        for (let name in Game.creeps) {
            const role = Game.creeps[name].memory.role;

            this.aliveCreeps[role] = (this.aliveCreeps[role] ?? 0) + 1;
        }
    }

    /**
     * Description - определяет объект ожидаемых крипов по ролям
     */
    defineExpectedCreeps() {
        const listTasks = this.memory.getFactoryTasks();

        for (let order in listTasks) {
            const role = listTasks[order].name;

            this.expectedCreeps[role] = (this.expectedCreeps[role] ?? 0) + 1;
        }
    }
}

export default CheckUnitsSystem;
