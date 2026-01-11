type TypeOrder = 'harvester' | 'builder' | 'carrier' | 'upgrader';

interface ListTasksItem {
    id: string;
    name: TypeOrder;
    type: string;
}