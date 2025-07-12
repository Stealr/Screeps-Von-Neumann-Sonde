class CheckUnitsSystem {
    constructor(roomName, FactorySystem) {
        this.factory = FactorySystem;
        this.roomName = roomName;

        this.reqCreeps = { harvester: 100, builder: 0, carrier: 0 }; // необходимые крипы
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
            for (let role in this.reqCreeps) {
                if (
                    (this.aliveCreeps?.[role] ?? 0) + (this.expectedCreeps?.[role] ?? 0) <
                    this.reqCreeps[role]
                ) {
                    // проверка есть ли живые крипы или ожидаемые поставки
                    const isAliveCreeps = (this.aliveCreeps?.[role] ?? 0) !== 0;
                    const isExpectedCreeps = (this.expectedCreeps?.[role] ?? 0) !== 0;

                    let lackCreeps;
                    if (isAliveCreeps && isExpectedCreeps) {
                        lackCreeps = this.reqCreeps[role] - (this.expectedCreeps[role] + this.aliveCreeps[role]);
                    } else if (isAliveCreeps === true && isExpectedCreeps === false) {
                        lackCreeps = this.reqCreeps[role] - this.aliveCreeps[role];
                    } else if (isAliveCreeps === false && isExpectedCreeps && true) {
                        lackCreeps = this.reqCreeps[role] - this.expectedCreeps[role];
                    } else {
                        lackCreeps = this.reqCreeps[role];
                    }

                    this.factory.createCreep(Array.from({ length: lackCreeps }, () => role));
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

            if (role in this.aliveCreeps) {
                this.aliveCreeps[role] += 1;
            } else {
                this.aliveCreeps[role] = 1;
            }
        }
    }

    /**
     * Description - определяет объект ожидаемых крипов по ролям
     */
    defineExpectedCreeps() {
        const listTasks = Memory.rooms[this.roomName].factory.listTasks;

        for (let order in listTasks) {
            const role = listTasks[order].name;

            if (role in this.expectedCreeps) {
                this.expectedCreeps[role] += 1;
            } else {
                this.expectedCreeps[role] = 1;
            }
        }
    }
}

module.exports = CheckUnitsSystem;
