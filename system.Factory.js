// типы order: harvester | builder | carrier

// id крипа: {roomName}{type}{creepNumRoom}-{creepNumGlobal}_{Bob}
// пример: W1R1H3-14_Bob
const MemoryManager = require('memory.Manage');
const templateCreeps = require('template.Creeps');

class FactorySystem {
    constructor(roomName) {
        this.roomName = roomName;
        this.memory = new MemoryManager(this.roomName);

        this.spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);
        this.listTasks = this.memory.getFactoryTasks();
    }

    run() {
        //! потом тут должно быть renew и reсycle действия

        if (this.listTasks.length !== 0) {
            // spawnCreep действие, дается заказ не занятому спавну
            for (let spawn = 0; spawn < this.spawns.length; spawn++) {
                const creepRole = this.listTasks[0].name;
                const creepBody = templateCreeps[creepRole];
                const creepId = this.listTasks[0].id;

                const response = this.spawns[spawn].spawnCreep(creepBody, creepId, {
                    dryRun: true,
                    memory: { role: creepRole },
                });
                const spawnIsActive = this.spawns[spawn].isActive();

                if (response === OK && spawnIsActive) {
                    this.spawns[spawn].spawnCreep(creepBody, creepId, {
                        memory: { role: creepRole, home: this.roomName },
                    });

                    // delete completed task
                    this.listTasks.splice(0, 1);
                }
            }
        }
    }

    /**
     * Description
     * @param {list} task '[harvester, harvester]'
     */
    createTask(task) {
        // формирование id
        const processedTasks = task.map((req) => {
            const typeCreep = req[0].toUpperCase();
            const creepNumRoom = this.memory.getCreepIdCounter();
            const creepNumGlobal = this.memory.getGlobalCreepIdCounter();
            const idCreep = `${this.roomName}${typeCreep}${creepNumRoom}-${creepNumGlobal}`;

            // повышение счетчика
            this.memory.incrementCreepIdCounter();

            const newTask = { id: idCreep, name: req, type: 'creep' };
            return newTask;
        });

        // добавление заказа в список
        this.listTasks.push(...processedTasks);
    }
}

module.exports = FactorySystem;
