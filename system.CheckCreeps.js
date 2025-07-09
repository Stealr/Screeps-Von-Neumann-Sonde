class CheckUnitsSystem {
    constructor(roomName, FactorySystem) {
        this.factory = FactorySystem;
        this.roomName = roomName;

        this.reqCreeps = { harvester: 2, builder: 1, carrier: 1 }; // необходимые крипы
        this.aliveCreeps = {}; // живые крипы
        this.expectedCreeps = {}; // ожидаемое пополнение крипов

        this.defineAliveCreeps();
        this.defineExpectedCreeps();

        //  количество необходимых крипов
        this.reqNum = Object.values(this.reqCreeps).reduce((acc, cur) => acc + cur, 0);
    }

    run() {
        console.log();
        console.log('---- Checker ----');

        const countCreeps = Object.keys(Game.creeps).length;

        if (countCreeps != this.reqNum) {
            this.defineCountingCreeps();

            for (let role in this.reqCreeps) {
                if (this.reqCreeps[role] !== this.aliveCreeps[role]) {
                    const expectedCreeps = 0;

                    //! написать логику - добавлять заказ * кол-во недостающих крипов
                    this.factory.addOrder(role);
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
        const listOrders = Memory.rooms[this.roomName].factory.listOrders;

        for (let order in listOrders) {
            const role = order.name;

            if (role in this.expectedCreeps) {
                this.expectedCreeps[role] += 1;
            } else {
                this.expectedCreeps[role] = 1;
            }
        }
    }
}

module.exports = CheckUnitsSystem;
