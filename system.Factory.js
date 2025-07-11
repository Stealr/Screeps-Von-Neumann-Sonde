// типы order: harvester | builder | carrier

// id крипа: {roomName}{type}{creepNumRoom}-{creepNumGlobal}_{Bob}
// пример: W1R1H3-14_Bob

class FactorySystem {
    constructor(roomName) {
        this.roomName = roomName;
        this.listTasks = Memory.rooms[roomName].factory.listTasks; //! Это должно быть в памяти
    }

    run() {
        // console.log('---- factory ----');
        // console.log('list orders: ', this.listTasks);
    }

    /**
     * Description
     * @param {list} orders '[harvester, harvester]'
     */
    addOrder(orders) {
        // формирование id
        const processedTasks = orders.map((req) => {
            const typeCreep = req[0].toUpperCase();
            const creepNumRoom = Memory.rooms[this.roomName].creepId;
            const creepNumGlobal = Memory.global.creepId;
            const idOrder = `${this.roomName}${typeCreep}${creepNumRoom}-${creepNumGlobal}`;
            
            // повышение счетчика
            Memory.rooms[this.roomName].creepId += 1;
            Memory.global.creepId += 1;

            const newOrder = { id: idOrder, name: req };
            return newOrder;
        });

        // добавление заказа в список
        this.listTasks.push(...processedTasks);
    }
}

module.exports = FactorySystem;
