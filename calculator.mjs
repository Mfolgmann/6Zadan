import { createInterface } from 'readline';

// Funkcja do wykonywania operacji matematycznych z użyciem callback
function asyncOperationCallback(num1, num2, operation, callback) {
    setTimeout(() => {
        let result;
        try {
            switch (operation) {
                case 'dodawanie':
                    result = num1 + num2;
                    break;
                case 'mnozenie':
                    result = num1 * num2;
                    break;
                default:
                    throw new Error('Nieznana operacja');
            }
            callback(null, result);
        } catch (error) {
            callback(error);
        }
    }, 1000);
}

// Funkcja do wykonywania operacji matematycznych z użyciem Promise
function asyncOperationPromise(num1, num2, operation) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                let result;
                switch (operation) {
                    case 'dodawanie':
                        result = num1 + num2;
                        break;
                    case 'mnozenie':
                        result = num1 * num2;
                        break;
                    default:
                        throw new Error('Nieznana operacja');
                }
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, 1000);
    });
}

// Funkcja główna
async function main() {
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Podaj pierwszą liczbę: ', (firstNum) => {
        readline.question('Podaj drugą liczbę: ', (secondNum) => {
            readline.question('Jaką operację chcesz wykonać (dodawanie/mnozenie)? ', (operation) => {
                readline.question('Jaką metodą przeprowadzić obliczenia (callback/promise)? ', (method) => {
                    const num1 = parseFloat(firstNum);
                    const num2 = parseFloat(secondNum);
                    
                    // Normalizowanie operacji
                    const normalizedOperation = operation.trim().toLowerCase();

                    if (method === 'callback') {
                        asyncOperationCallback(num1, num2, normalizedOperation, (error, result) => {
                            if (error) {
                                console.error('Błąd:', error.message);
                            } else {
                                console.log('Wynik:', result);
                            }
                            readline.close();
                        });
                    } else if (method === 'promise') {
                        asyncOperationPromise(num1, num2, normalizedOperation)
                            .then(result => {
                                console.log('Wynik:', result);
                            })
                            .catch(error => {
                                console.error('Błąd:', error.message);
                            })
                            .finally(() => {
                                readline.close();
                            });
                    } else {
                        console.log('Nieznana metoda');
                        readline.close();
                    }
                });
            });
        });
    });
}

// Uruchomienie programu
main();
