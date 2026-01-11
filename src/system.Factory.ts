// типы order: harvester | builder | carrier

// id крипа: {roomName}{type}{creepNumRoom}-{creepNumGlobal}_{Bob}
// пример: W1R1H3-14_Bob
import MemoryManager from './memory.Manage';
import templateCreeps from './template.Creeps';

const BODYPARTS_COST: Record<BodyPartConstant, number> = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
}

class FactorySystem {
    roomName: string;
    memory: MemoryManager;
    spawns: StructureSpawn[];
    listTasks: ListTasksItem[];

    constructor(roomName: string) {
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
                    // @ts-ignore: dryRun mode doesn't need full CreepMemory (missing home)
                    memory: { role: creepRole },
                });
                const spawnIsActive = this.spawns[spawn].isActive();

                if (response === OK && spawnIsActive) {
                    const cost = creepBody.reduce((acc, part) => acc + BODYPARTS_COST[part], 0)
                    this.memory.addExpense(cost);

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
    createTask(task: TypeOrder[]) {
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

export default FactorySystem;
