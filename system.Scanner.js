class ScannerSystem {
    constructor(roomName) {
        this.roomName = roomName;
    }

    scanEnergy() {
        if (Memory.rooms[this.roomName].scanned) return

        const energyList = Game.rooms[this.roomName].find(FIND_SOURCES);

        for (const name in energyList) {
            let availableCells = 0;

            const cordX = energyList[name].pos.x;
            const cordY = energyList[name].pos.y;

            for (let x = cordX - 1; x <= cordX + 1; x++) {
                for (let y = cordY - 1; y <= cordY + 1; y++) {
                    if (x === cordX && y === cordY) continue;
                    if (x < 0 || x > 49 || y < 0 || y > 49) continue;

                    const terrain = Game.rooms[this.roomName].getTerrain();
                    if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                        availableCells += 1;
                    }
                }
            }

            Memory.rooms[this.roomName].resources.energySources[energyList[name].id] = {
                current: 0,
                max: availableCells,
            };
        }
        console.log(`комната ${this.roomName} просканирована`)
        Memory.rooms[this.roomName].scanned = true;
    }
}

module.exports = ScannerSystem;
