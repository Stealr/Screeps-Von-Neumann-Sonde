type CreepRoles = 'harvester' | 'builder' | 'upgrader' | 'carrier';

interface CreepMemory {
    role: CreepRoles;
    home: string;
    target?: Id<Source> | Id<ConstructionSite> | null;
}