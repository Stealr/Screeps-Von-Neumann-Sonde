# Von-Neumann — видение проекта

Скрипты для [Screeps](https://screeps.com/): полностью автоматизированное поселение с последующей автоколонизацией мира.

Имя отсылает к машине фон Неймана: ядро комнаты умеет расти и порождать новые ядра.

Схемы (Miro / `docs/.../schemes`) могут отставать от кода — канон поведения фиксируется здесь и в `.cursor/rules/`.

---

## Цель

1. **Этап 1** — комната сама развивается (стройка, крипы, экономика, базовая оборона).
2. **Этап 2+** — выход за пределы ячейки: remote, claim, сеть поселений.

Пока критерий этапа 1a не выполнен, multi-room и колонизация не начинаются.

---

## Архитектура

Комнатная модель: решения на уровне систем, крип — исполнитель.

```text
Main
 └─ RoomCore (на каждую контролируемую комнату)
     ├─ Memory init / clear
     ├─ Scanner
     ├─ CheckCreeps ──► Factory.listTasks ──► spawn / (позже renew, recycle)
     ├─ Creeps ──► roles (harvester, builder, upgrader, carrier, …)
     ├─ Building
     ├─ Economy (stats → решения о масштабе)
     └─ Defense
```

- **RoomCore** — оркестратор тика комнаты.
- **Factory** — единственная точка работ завода; очередь — `Memory.rooms[room].factory.listTasks`.
- **Роли** — действия creep (move / harvest / transfer / build / upgrade), без политики комнаты.

---

## Сборка и deploy (бандлер)

Screeps не рассчитан на вложенные папки модулей: клиент/игра ожидают плоский набор скриптов или один entry.

**Канон проекта — вариант B: бандлер** (rollup или webpack):

- В `src/` допускаются папки (`systems/`, `memory/`, `roles/`, …).
- Перед deploy бандлер собирает артефакт для игры (предпочтительно один `main.js` или эквивалентный плоский выход).
- `deploy` копирует **результат бандла**, не сырое дерево `tsc` с вложенными путями.
- Сейчас временно: `tsc` → `dist/` → copy. Переход на бандлер — задача бэклога `0.9` (сделать до активного разнесения кода по папкам).

`deploy.js` / `npm run build` должны в итоге вызывать бандл, а не полагаться на зеркалирование папок `src` → `dist`.

---

## Тесты

Только **unit-тесты** чистой логики в Node (Vitest или Jest).

- Покрывать вычисления и правила без живого `Game` API: `lack` крипов, приоритеты складов, body от energy, синхрон `listTasks`, и т.п.
- Тесты лежат вне игрового entry (например `tests/` или `*.test.ts`), **не** попадают в бандл/deploy.
- Моки полного Screeps API и интеграция с private server — **вне объёма**; не заводить без отдельного решения в VISION.

Каркас тестов — задача `0.10`.

---

## Статус: схемы vs код

| Область | Схемы | Код | Статус |
|---------|-------|-----|--------|
| Main / RoomCore | есть | одна комната, метод `test()` | частично |
| Memory init / clear | есть | есть | реализовано |
| Scanner sources | есть | one-shot scan | реализовано |
| CheckCreeps + Factory | есть | RCL1-тела, очередь задач | частично |
| Harvester + слоты | есть | есть | частично |
| Builder | есть | есть | частично |
| Upgrader | есть | роль есть, `reqCreeps.upgrader = 0` | частично |
| Carrier | TS→SLC/FS | заглушка | нет |
| Warehouses FS/TS/SLC | модель | только FS = spawn | stub |
| Building stages RCL1–2 | 4 стадии | roads spawn→sources | stub |
| Economy surplus→scale | есть | Logger + placeholder profit | stub |
| Defense | TBD | нет | нет |
| Multi-room / colonize | цель | нет | нет |

---

## Roadmap

### Этап 0 — стабилизация каркаса

Цель: вертикальный срез RCL1 без известных багов, чистый loop.

**Критерий:** тик комнаты стабилен; profit/expense осмысленны; нет залипания factory; крипы учитываются по `home`; бандлер собирает deploy-артефакт; есть каркас unit-тестов.

### Этап 1a — самодостаточная ячейка (RCL1–4/5)

Цель: новая комната с нуля доходит до устойчивого RCL4–5 (extensions, контейнеры/TS, upgrader, башня) без ручных правок Memory.

**Критерий готовности 1a:** авто bootstrap до RCL4–5 + базовая оборона. После этого можно планировать этап 2.

### Этап 1b — зрелая комната (RCL6–8)

Storage как SLC, далее terminal/market/labs по отдельным задачам. Не блокер для начала этапа 2, если 1a готов.

### Этап 2 — выход за комнату

Remote mining / outpost, scout и оценка комнат, claimer + infant `RoomCore`, межкомнатная логистика.

### Этап 3 — империя (набросок)

Глобальный планировщик над RoomCore, лимиты CPU/GCL, market/labs/power/intershard по мере необходимости.

---

## Бэклог задач

Каждая задача при разработке = **один коммит → ревью**. Код в этой итерации документации не меняется.

### Этап 0

| ID | Задача |
|----|--------|
| 0.1 | `RoomCore.test` → `run` (без смены логики) |
| 0.2 | Убрать placeholder `addProfit(1)`; profit по факту transfer |
| 0.3 | Roads: не ставить construction site на клетку source |
| 0.4 | Game-init flag из `Memory.flags` → `Memory.von` / `Memory.meta` |
| 0.5 | Подсчёт и фильтр крипов по `creep.memory.home === roomName` |
| 0.6 | CheckCreeps: `lack = req - alive - expected` |
| 0.7 | Factory: синхрон `listTasks` при смене `reqCreeps` (без залипания) |
| 0.8 | Один memory-контекст на тик комнаты (прокидывать в системы) |
| 0.9 | Бандлер (rollup/webpack): сборка в артефакт для Screeps; deploy из бандла |
| 0.10 | Каркас unit-тестов (Vitest/Jest) + первые тесты на чистую логику |

### Этап 1a

| ID | Задача |
|----|--------|
| 1a.1 | Roads → controller (+ доработка stage 1) |
| 1a.2 | 5 extensions у spawn |
| 1a.3 | Контейнеры у sources → регистрация как TS |
| 1a.4 | Monitor completion: site исчез + structure есть → запись в memory по типу |
| 1a.5 | Harvester deposit: TS, иначе FS |
| 1a.6 | Carrier: TS → FS / SLC |
| 1a.7 | Withdraw SLC → TS → FS для builder/upgrader (убрать log-заглушки) |
| 1a.8 | Динамический `reqCreeps` |
| 1a.9 | Body templates от `energyCapacityAvailable` |
| 1a.10 | Economy: surplus → лёгкий scale builders/upgraders |
| 1a.11 | Tower + минимальный DefenseSystem |

### Этап 1b / 2 / 3

Кратко, без детализации до завершения 1a:

- **1b:** storage как SLC; terminal/market; labs отдельным треком.
- **2:** remote, scout, claim, bootstrap колонии.
- **3:** empire brain, CPU/GCL лимиты, поздние системы.

---

## Memory

**Гибрид accessors по доменам** — не один раздутый файл на все фичи и не сырой `Memory.*` в системах/ролях.

- Централизованно: init, clear мёртвых, id-счётчики, stats API.
- Со временем разбиение, например: Game / Room / Storage / Factory accessors.
- Системы ходят в свой accessor; прямой запись `Memory.rooms[x].…` вне accessor-слоя запрещена соглашением проекта.

Сейчас точка входа — `memory.Manage.ts`; разбиение — отдельные задачи после этапа 0.

---

## Словарь

| Термин | Значение |
|--------|----------|
| **FS** | Factory Storage — склады завода (spawns) |
| **TS** | Transshipment — перевалка у источника (обычно container) |
| **SLC** | Long-term storage — долговременный склад (storage / крупные контейнеры) |
| **`listTasks`** | Очередь работ Factory в `Memory.rooms[room].factory.listTasks` |
| **`reqCreeps`** | Целевая численность ролей в комнате |
| **Роли** | `harvester`, `builder`, `upgrader`, `carrier` |

### Соответствие схемам

| На схеме | В коде / каноне |
|----------|-----------------|
| `listOrders` | `factory.listTasks` |
| RoomSystem | `RoomCore` |

### Канон складов

- Harvester deposit: **TS → иначе FS**
- Builder / upgrader withdraw: **SLC → TS → FS**
- Carrier: **TS → SLC / FS**

Почему `listTasks`, а не `listOrders`: элемент очереди уже имеет `type` — это работы завода (spawn сейчас; renew/recycle позже), а не только «заказ крипа». Имя `order` позже пересечётся с Market (`Game.market`).

---

## Процесс разработки

1. Одна задача из бэклога → один узкий diff.
2. Коммит с понятным «почему».
3. Ревью перед следующей задачей.
4. Не смешивать рефакторинг с новой фичей без необходимости.

Текущий фокус после этой документации: **этап 0**, задачи по порядку `0.1` … `0.10`.
Разносить runtime-код по папкам в `src/` — только после `0.9` (бандлер).
