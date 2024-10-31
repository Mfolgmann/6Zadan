// import fs from 'fs'



// fs.stat("example.txt", (err, stats)=>{
//     if(err){
//         console.log(err)
//     }else{
//         if(stats.isDirectory()){
//             console.log("to folder")
//         }else{
//             console.log("to nie folder")
//         }
//     }
// })









// async function getFileStats() {
//     try{
//         const stats = await fs.promises.stat('example.txt')
//         console.log(stats)
//     }catch(err){
//         console.log(err)
//     }
// }

// getFileStats()







// // fs.stat('example.txt', (err, stats)=>{
// //     if(err){
// //         console.error("blad, ", err)
// //         return
// //     }

// //     console.log("inf o pliku")
// //     console.log(stats)
// // })

import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';

// Klasa do analizy plików
class FileAnalyzer extends EventEmitter {
    constructor(directoryPath) {
        super();
        this.directoryPath = directoryPath;
    }

    analyze() {
        this.emit('analysisStarted', this.directoryPath);
        fs.readdir(this.directoryPath, (err, files) => {
            if (err) {
                console.error('Błąd podczas odczytu katalogu:', err);
                return;
            }

            files.forEach(file => {
                const filePath = path.join(this.directoryPath, file);
                this.emit('fileAnalysisStarted', file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error('Błąd podczas pobierania informacji o pliku:', err);
                        return;
                    }

                    if (stats.isFile()) {
                        this.logFileDetails(file, stats);
                    } else if (stats.isDirectory()) {
                        console.log(`Folder: ${file}`);
                    }

                    this.emit('fileAnalysisEnded', file);
                });
            });

            this.emit('analysisEnded', this.directoryPath);
        });
    }

    logFileDetails(file, stats) {
        const fileSize = stats.size; // rozmiar w bajtach
        const fileExtension = path.extname(file); // rozszerzenie pliku
        const modifiedDate = stats.mtime; // data ostatniej modyfikacji
        console.log(`Plik: ${file}, Rozmiar: ${fileSize} bajtów, Rozszerzenie: ${fileExtension}, Ostatnia modyfikacja: ${modifiedDate}`);
    }
}

// Funkcja do uruchomienia analizy
function main(directoryPath) {
    const fileAnalyzer = new FileAnalyzer(directoryPath);

    fileAnalyzer.on('analysisStarted', (path) => {
        console.log(`Rozpoczęto analizę katalogu: ${path}`);
    });

    fileAnalyzer.on('fileAnalysisStarted', (file) => {
        console.log(`Analiza pliku rozpoczęta: ${file}`);
    });

    fileAnalyzer.on('fileAnalysisEnded', (file) => {
        console.log(`Analiza pliku zakończona: ${file}`);
    });

    fileAnalyzer.on('analysisEnded', (path) => {
        console.log(`Analiza katalogu zakończona: ${path}`);
    });

    fileAnalyzer.analyze();
}

// Sprawdzanie argumentów wiersza poleceń
const directoryPath = process.argv[2];
if (!directoryPath) {
    console.error('Proszę podać ścieżkę do katalogu jako argument.');
    process.exit(1);
}

// Uruchomienie programu
main(directoryPath);
