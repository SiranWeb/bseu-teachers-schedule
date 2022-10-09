import readline from 'readline';

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Async readline.question
 * @param {string} text
 * @returns {Promise<string>}
 */
function ask(text) {
  return new Promise(resolve => {
    readlineInterface.question(text, resolve);
  })
}

export default ask;