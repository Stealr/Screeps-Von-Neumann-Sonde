# Von-Neumann

скрипты для [Screeps](https://screeps.com/): комната как самовоспроизводящееся ядро (отсылка к машине фон Неймана) — сначала устойчивое поселение, затем автоколонизация.

**Сейчас:** этап 0 завершён — каркас одной комнаты (RCL1-срез): scan sources, factory + роли harvester/builder, дороги spawn→sources, stats, rollup-бандл, unit-тесты.  
**Дальше:** этап 1a — bootstrap до RCL4–5 (extensions, контейнеры/TS, upgrader, carrier, башня). Multi-room и колонизация — после критерия 1a.

Канон поведения: [docs/my_project_doc/VISION.md](docs/my_project_doc/VISION.md).  
Схемы (могут отставать от кода): [Miro](https://miro.com/app/board/uXjVIg0LRt0=/?share_link_id=496012522179).

Архитектура тика: `Main` → `RoomCore` → Scanner / Factory / CheckCreeps / Creeps / Building / Logger. Решения на уровне систем, creep — исполнитель.

---

## Запуск

Нужны **Node.js** и локальный клиент Screeps (Steam), куда копируется бандл.

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` в корне (см. `.env template`):

```env
DEPLOY_LOCAL_PATH=C:\Users\<you>\AppData\Local\Screeps\scripts\<server>\<branch>
```

Путь — папка скриптов нужного сервера/ветки в клиенте Screeps (туда кладётся `main.js`).

3. Собрать и задеплоить:

```bash
npm run deploy
```

Либо только сборка в `dist/main.js`:

```bash
npm run build
```

4. В игре выбрать ту же ветку скриптов и убедиться, что активен модуль `main` с `loop`.

### Полезные команды

| Команда | Назначение |
|---------|------------|
| `npm run deploy` | Rollup-бандл + копирование в `DEPLOY_LOCAL_PATH` |
| `npm run watch` | Пересборка при изменениях + deploy |
| `npm run build` | Только `dist/main.js` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit-тесты (Vitest) |

Тесты и исходники в `src/` в клиент не копируются — в игру уходит один бандл.
