interface FinanceEvent {
    amount: number;
    tick: number;
}

interface Memory {
    global: {
        creepId: number;
        tick: number;
        stats: {
            energy: {
                totalProfit: FinanceEvent[];
                totalExpense: FinanceEvent[];
            };
        };
    };
    flags: {
        initiatedMem: boolean;
    };
}

interface RoomMemory {
    creepId: number;
    reqCreeps: Record<CreepRoles, number>;
    factory: {
        listTasks: ListTasksItem[];
    };
    storages: {
        SLC: Id<StructureStorage>[] | Id<StructureContainer>[];
        TS: Id<StructureStorage>[] | Id<StructureContainer>[];
        FS: Id<StructureSpawn>[];
    };
    resources: {
        energySources: {
            [idSource: string]: {
                current: number;
                max: number;
            };
        };
    };
    stats: {
        energy: {
            profit: FinanceEvent[];
            expense: FinanceEvent[];
        };
    };
    flags: {
        initiatedMem: boolean;
        scanned: boolean;
        firstStageBuilding?: boolean;
    };
}
