# Seminar M2L15: Отладка и профилирование Node.js   (21.06.24)

## Отладка и Профилирование
 Отладка - поиск (локализация), анализ и устранение ошибок в ПО, которые были найдены во время тестирования.

Что нужно для отладки
1. Знать состояние переменных
2. Отслеживать ход программы
3. breakpoints
4. optional breakpoints
5. менять код на лету (daemon mode например)
6. мониторинг использования памяти
7. мерить время выполнения кода

### [node:console](https://nodejs.org/api/console.html#console)

Модуль на самом деле содержит множество возможностей для дебага.
К примеру `console.assert` повозяет выводить сообщение если значение *falsy/ormitted*
`console.dir` позволяет с помощью `util.inspect` выводить в stdout сложные объекты.
С помощью `console.time` & `console.timeEnd` можно мерить время.

**2-4 пункты не получиться решить с помощью console**

### Стэк

new Error().stack - текущий стек

Можно притянуть текущий стэк любому объекту как свойство `Error.captureStack(targetObject[,constructoreOptions]).

### [Performance](https://developer.mozilla.org/ru/docs/Web/API/Performance)

JS интерфейс представляющий информацию о производительности страницы с временными метками

**Методы:**
- `Performance.now()` - кол-во миллисекунд, прошедших с начала отсчета
- `Performance.mark()` - создать метку
- `Performance.measure()` - вычисляет время между метками


### Memory Usage
```javascript
process.memoryUsage()
{
    rss: integer, // количество памяти занимаемого в устройстве основной памяти
    heapTotal: integer, // сколько памяти V8 зарезервировал
    heapUsed: integer, // сколько реально V8 использовал
    external: integer,
    arrayBuffers: integer
}
```
```javascript
const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`

export default {
  show() {
    const memoryData = process.memoryUsage()

    const memoryUsage = {
      rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
      heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
      heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
      external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
    }

    console.log(memoryUsage)
  }
}
```
### логгеры
- winston
- pino

Логи можно писать:
 - в файл
 - в базу
 - в stdout
 - в источник сборки логов

Для мониторинга ошибок и всего на свете можно использовать сторонние решения (например [sentry](https://sentry.io/welcome/)/[rollbar](https://rollbar.com/))

### Node inspect
`node --inspect <entrypoint>`
Поднимается дебаг сервер, который можно открыть в devTools хромиума или в IDE.

Может быть полезно, чтобы подключиться к контейнеру прод-сервера и дебажить и перезапускать сервис прямо внутри собранного контейнера 
## Ошибки
Основные способы вернуть ошибку из функции:
- throw exception
- callback function
- Генерация события 'error' у объектов класса EventEmitter

Должен быть организован синхронный или асинхронный возврат ошибки, но не одновременно

### Типы ошибок

Программные ошибки:
- некорректные данные
- request timeout
- 500
- разрыв соединения
- израсходована выделенная память

Эти ошибки должны быть обработаны, если обработчик отсутствует - это ошибка программиста.

Ошибки программиста:
- calling undefined
- async without callback
- call func with incorrect parameters
- syntax errors

Для создания ошибок используем Error или его подклассы.

## Идентификация запросов
Для сопоставления запросов между микросервисами
добавляем в логи user_id или request_id.
[Введение в паттерн распределенной трассировки](https://habr.com/ru/company/otus/blog/538984/)

## Профилирование
Есть спец. библиотеки для профилирования, например [clinic](https://www.clinicjs.org/)
## Встроенные модули

### node:async_hooks

позволяет подробно трекать фазы асинхронного кода
```javascript
import async_hooks from 'async_hooks'
const asyncHook =
 async_hooks.createHook({ init, before, after, destroy,
promiseResolve });
asyncHook.enable()
asyncHook.disable()
```

### node:perf_hooks

предоставляет реализацию подмножества Web Performance APIs, а также доп. интерфейсы для измерения производительности, специфичной для Node.js
 
```javascript
import { performance } from 'node:perf_hooks';

performance.mark('performance start');
sum = 0;
for (var i = 0; i < 100000; i++) {
    sum+=i;
}
performance.mark('performance end');
performance.measure('duration', 'performance start', 'performance end');
const measures = performance.getEntriesByType('measure');
measures.forEach(measure => {
    console.log(`${measure.name}: ${measure.duration}`);
});
```
### Доп. материалы:

- [Как логировать в NodeJS, чтобы пацаны во дворе уважали](https://habr.com/ru/articles/442452/)
- [Обработка ошибок в Node.js](https://habr.com/ru/articles/222761/)
- [Понимание сборки мусора и отлов утечек памяти в Node.js](https://habr.com/ru/companies/plarium/articles/277129/)
- [Профилирование Node.js. Доклад Яндекса](https://habr.com/ru/companies/yandex/articles/546524/)
- [Отладка и профилирование node.js приложений](https://www.youtube.com/watch?v=w3gF38bfeCI)



