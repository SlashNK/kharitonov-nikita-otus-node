import * as fs from "node:fs";
import * as fsP from "node:fs/promises";
import * as path from "node:path";
import { Transform, pipeline } from "node:stream";
import { promisify } from "node:util";
const DEBUG = true;
const OUTPUT_FILEPATH = "./output.out";
const pipelinePromise = promisify(pipeline);
const createReadStreamFromFile = (filePath) => {
  const readStream = fs.createReadStream(filePath);
  readStream.setEncoding("utf-8");
  if (DEBUG) {
    readStream.on("data", (chunk) => {
      console.debug("reading chunk", chunk);
    });
  }
  readStream.on("error", (error) => {
    console.error(error.stack);
  });
  return readStream;
};
const createWriteStreamToFile = (filePath) => {
  const writeStream = fs.createWriteStream(filePath);
  writeStream.setDefaultEncoding("utf-8");
  if (DEBUG) {
    writeStream.on("finish", (chunk) => {
      console.debug("Writing finished.");
    });
  }
  writeStream.on("error", (error) => {
    console.error(error.stack);
  });
  return writeStream;
};
class TextIndexingTransform extends Transform {
  wordsCounts = new Map();
  remainingChunk = "";
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  _transform(chunk, encoding, callback) {
    let text = this.remainingChunk + chunk.toString();
    //заменяем все не-словесные символьные последовательности на разделитель
    text = text.replace(/\s+/, " ");
    //разбиваем чанк на слова
    const words = text.split(" ");
    //Чанк в конце может захватить часть слова, поэтому сохраняем ее, чтобы приплюсовать со следующим чанком
    this.remainingChunk = words.pop();
    words.forEach((word) => {
      word = word.replace(/[^a-zA-Zа-яА-Я0-9]/g, "").toLowerCase();
      if (word) {
        if (DEBUG) {
          console.debug(`word: ${word}`);
        }
        this.wordsCounts.set(word, (this.wordsCounts.get(word) || 0) + 1);
      }
    });
    callback();
  }
  _flush(callback) {
    if (this.remainingChunk !== "") {
      const word = this.remainingChunk
        .replace(/[^a-zA-Zа-яА-Я0-9]/g, "")
        .toLowerCase();
      if (word) {
        if (DEBUG) {
          console.debug(`word: ${word}`);
        }
        this.wordsCounts.set(word, (this.wordsCounts.get(word) || 0) + 1);
      }
    }
    this.push(this.wordsCounts);
    callback();
  }
}
class MapToSortedArrayTransform extends Transform {
  constructor() {
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  _transform(obj, encoding, callback) {
    const sortedWords = Array.from(obj.keys()).sort();
    if (DEBUG) {
      console.log(sortedWords.map((word) => obj.get(word)).join(","));
    }
    this.push(sortedWords.map((word) => obj.get(word)).join(","));
    callback();
  }
}
const args = process.argv.slice(2);
const filePath = args[0];
if (!filePath) {
  console.error("file path was not provided");
  process.exit(0);
}
let absolutePath;
try {
  absolutePath = path.resolve(filePath);
  await fsP.access(absolutePath);
} catch (e) {
  console.error("Error while trying to reach file", e);
  process.exit(0);
}
(async () => {
  try {
    await pipelinePromise(
      createReadStreamFromFile(absolutePath),
      new TextIndexingTransform(),
      new MapToSortedArrayTransform(),
      createWriteStreamToFile(OUTPUT_FILEPATH)
    );
    if (DEBUG) {
      console.debug("Pipeline ended successfully.");
    }
  } catch (err) {
    console.error("Error while executing pipeline", err);
  }
})();
