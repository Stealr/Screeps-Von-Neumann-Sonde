// типы order: harvester | builder | carrier

// id крипа: {roomName}{type}{creepNumRoom}-{creepNumGlobal}_{Bob}
// пример: W1R1H3-14_Bob

class FactorySystem {
    constructor(roomName) {
        this.roomName = roomName;
        this.listTasks = Memory.rooms[roomName].factory.listTasks; //! Это должно быть в памяти
    }

    run() {

    }

    /**
     * Description
     * @param {list} task '[harvester, harvester]'
     */
    addTask(task) {
        // формирование id
        const processedTasks = task.map((req) => {
            const typeCreep = req[0].toUpperCase();
            const creepNumRoom = Memory.rooms[this.roomName].creepId;
            const creepNumGlobal = Memory.global.creepId;
            const idCreep = `${this.roomName}${typeCreep}${creepNumRoom}-${creepNumGlobal}`;
            
            // повышение счетчика
            Memory.rooms[this.roomName].creepId += 1;
            Memory.global.creepId += 1;

            const newTask = { id: idCreep, name: req };
            return newTask;
        });

        // добавление заказа в список
        this.listTasks.push(...processedTasks);
    }
}

module.exports = FactorySystem;
