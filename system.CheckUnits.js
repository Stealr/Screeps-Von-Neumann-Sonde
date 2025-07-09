class CheckUnitsSystem {
    constructor(FactorySystem) {
        //! возможно нужно переместить на уровень выше
        this.factory = FactorySystem;

        // необходимые крипы | количество необходимых крипов
        this.reqCreeps = { harvester: 2, builder: 1, carrier: 1 };
        this.reqNum = Object.values(this.reqCreeps).reduce((acc, cur) => acc + cur, 0);

        // количество действующих крипов
        this.currentAliveCreeps = {};
    }

    run() {
        console.log();
        console.log('---- Checker ----');

        const countCreeps = Object.keys(Game.creeps).length;

        if (countCreeps != this.reqNum) {
            this.countingCreeps();

            for (let role in this.reqCreeps) {
                //! написать логику - добавлять заказ * кол-во недостающих крипов
                if (this.reqCreeps[role] !== this.currentAliveCreeps[role]) {

                    this.factory.addOrder(role);
                }
            }
        }
    }

    /**
     * Description - вычисляет кол-во  живых крипов
     */
    countingCreeps() {
        this.currentAliveCreeps = {};

        for (let name in Game.creeps) {
            const role = Game.creeps[name].memory.role;

            if (role in this.currentAliveCreeps) {
                this.currentAliveCreeps[role] += 1;
            } else {
                this.currentAliveCreeps[role] = 1;
            }
        }
    }
}

module.exports = CheckUnitsSystem;
