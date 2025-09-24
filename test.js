const wait = (ms) => new Promise(res => setTimeout(res, ms));


function checkBalance(userId, amount) {
  return new Promise(async (resolve, reject) => {
    await wait(300); 
    const fakeBalances = {
      'alice': 1200,
      'bob': 50,
      'charlie': 500
    };
    const balance = fakeBalances[userId] ?? 0;

    if (Math.random() < 0.05) return reject(new Error('Network error while checking balance'));

    if (balance >= amount) resolve({ balance });
    else reject(new Error('Insufficient funds'));
  });
}


function deductAmount(userId, amount) {
  return new Promise(async (resolve, reject) => {
    await wait(250);
    
    if (Math.random() < 0.04) return reject(new Error('Processing error while deducting amount'));

    resolve({ newBalance: Math.max(0, 1000 - amount) });
  });
}

function confirmTransaction(userId, amount, newBalance) {
  return new Promise(async (resolve, reject) => {
    await wait(200);
    if (Math.random() < 0.03) return reject(new Error('Confirmation failed'));

    resolve({ message: 'Transaction confirmed', txId: `TX-${Date.now()}` });
  });
}


function transfer(userId, amount) {
  return checkBalance(userId, amount)
    .then(({ balance }) => {
     
      return deductAmount(userId, amount)
        .then(({ newBalance }) => {
          
          return confirmTransaction(userId, amount, newBalance)
            .then(({ message, txId }) => {
              return {
                status: 'Transaction complete',
                userId,
                amount,
                previousBalance: balance,
                newBalance,
                confirmationMessage: message,
                txId
              };
            });
        });
    });
}

transfer('alice', 200)
  .then(result => console.log('Promise chain result:', result))
  .catch(err => console.error('Promise chain error:', err.message));


async function runTransfer(userId, amount) {
  try {
    const check = await checkBalance(userId, amount);
    const deducted = await deductAmount(userId, amount);
    const confirmed = await confirmTransaction(userId, amount, deducted.newBalance);
    console.log('Async/await result:', {
      status: 'Transaction complete',
      userId,
      amount,
      previousBalance: check.balance,
      newBalance: deducted.newBalance,
      confirmationMessage: confirmed.message,
      txId: confirmed.txId
    });
  } catch (err) {
    console.error('Async/await error:', err.message);
  }
}


runTransfer('bob', 30);      
runTransfer('charlie', 200); 
