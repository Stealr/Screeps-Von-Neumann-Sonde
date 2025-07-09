// типы order: harvester | builder | carrier

// id крипа: {roomName}{type}{creepNumRoom}-{creepNumGlobal}_{Bob}
// пример: W1R1H3-14_Bob

class FactorySystem {
    constructor(roomName) {
        this.roomName = roomName;
        this.listOrders = Memory.rooms[roomName].factory.listOrders; //! Это должно быть в памяти
    }

    run() {
        console.log('---- factory ----');
        console.log('list orders: ', this.listOrders);
    }

    addOrder(order) {
        // формирование id
        const typeCreep = order[0].toUpperCase();
        const creepNumRoom = Memory.rooms[this.roomName].creepId;
        const creepNumGlobal = Memory.global.creepId;
        const idOrder = `${this.roomName}${typeCreep}${creepNumRoom}-${creepNumGlobal}`;

        // добавление заказа в список
        //? возможно потом надо будет добавить type???
        const newOrder = { id: idOrder, name: order };
        this.listOrders.push(newOrder);

        // повышение счетчика

    }
}

module.exports = FactorySystem;
