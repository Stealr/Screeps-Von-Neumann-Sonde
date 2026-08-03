import MemoryManager from './memory.Manage';

class Logger {
    room: string;
    memory: MemoryManager;

    constructor(room: string) {
        this.room = room;
        this.memory = new MemoryManager(this.room);
    }

    run() {
        this.logEnergyIncomePerMinute();
    }

    logEnergyIncomePerMinute() {
        const stats = this.memory.getRoomEnergyStats();
        const profit = stats.profit;
        const expense = stats.expense;

        const profitPerMinute = profit.reduce((sum, event) => sum + event.amount, 0);
        const expensePerMinute = expense.reduce((sum, event) => sum + event.amount, 0);
        const netIncome = profitPerMinute - expensePerMinute;

        console.log('--- Energy income per minute ---', Game.time);
        console.log(`Profit: +${profitPerMinute}/min`);
        console.log(`Expense: -${expensePerMinute}/min`);
        console.log(`Net: ${netIncome > 0 ? '+' : ''}${netIncome}/min`);
    }
}

export default Logger;
