## Problems of code

1. Двойная логика списка задач завода
Зачем нужны данные функции:
``` ts
getFactoryTasks() {
    return Memory.rooms[this.roomName]?.factory.listTasks;
}

addTask(task: ListTasksItem) {
    Memory.rooms[this.roomName].factory.listTasks.push(task);
}

addTasks(tasks: ListTasksItem[]) {
    Memory.rooms[this.roomName].factory.listTasks.push(...tasks);
}

removeFirstTask() {
    return Memory.rooms[this.roomName].factory.listTasks.shift();
}
```

Если listTasks обновляется локально в system.Factory. Возможно что то работает не так

2. home обязателен, но из за этого в методе dry требует его. Хотя он там не нужен
``` ts
const response = this.spawns[spawn].spawnCreep(creepBody, creepId, {
    dryRun: true,
    memory: { role: creepRole },
});
```

3. Ищется по всем комнатам???
Если так то это ошибка. Необходим поиск по определенной комнате
``` ts
replenishment =
    Game.spawns[
        listStorage.FS.find((storage) => {
            return Game.spawns[storage].store.getUsedCapacity(RESOURCE_ENERGY) > 10;
        })
    ];

```