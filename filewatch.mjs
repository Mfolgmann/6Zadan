import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import { createWriteStream } from 'fs';

// Ustawienia
const directoryPath = './monitor'; // Ścieżka do katalogu do monitorowania
const logFilePath = './file_changes.log'; // Ścieżka do pliku logów

// Klasa do logowania
class Logger {
    constructor(logFilePath) {
        this.logStream = createWriteStream(logFilePath, { flags: 'a' });
    }

    log(message) {
        const logMessage = `${new Date().toISOString()} - ${message}\n`;
        this.logStream.write(logMessage);
        console.log(logMessage.trim());
    }
}

// Klasa do monitorowania plików
class FileWatcher extends EventEmitter {
    constructor(directoryPath) {
        super();
        this.directoryPath = directoryPath;
        this.logger = new Logger(logFilePath);
    }

    start() {
        fs.watch(this.directoryPath, (eventType, filename) => {
            if (filename) {
                const filePath = path.join(this.directoryPath, filename);
                switch (eventType) {
                    case 'rename':
                        fs.access(filePath, fs.constants.F_OK, (err) => {
                            if (err) {
                                this.emit('fileDeleted', filename);
                            } else {
                                this.emit('fileAdded', filename);
                            }
                        });
                        break;
                    case 'change':
                        this.emit('fileChanged', filename);
                        break;
                }
            }
        });

        this.on('fileAdded', (filename) => {
            this.logger.log(`Dodano plik: ${filename}`);
        });

        this.on('fileChanged', (filename) => {
            this.logger.log(`Zmieniono plik: ${filename}`);
        });

        this.on('fileDeleted', (filename) => {
            this.logger.log(`Usunięto plik: ${filename}`);
        });
    }
}

// Tworzenie instancji i uruchomienie monitorowania
const fileWatcher = new FileWatcher(directoryPath);
fileWatcher.start();

console.log(`Monitorowanie zmian w katalogu: ${directoryPath}`);
