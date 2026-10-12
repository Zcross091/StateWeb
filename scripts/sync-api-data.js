const fs = require('fs');
const path = require('path');

async function syncData() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    const giftRes = await fetch('https://whiteoutsurvival.dev/api/gift-codes');
    if (giftRes.ok) {
      const giftData = await giftRes.json();
      fs.writeFileSync(path.join(dataDir, 'gift-codes.json'), JSON.stringify(giftData, null, 2));
      console.log('Saved data/gift-codes.json');
    }
  } catch (err) {
    console.error('Error fetching gift codes:', err.message);
  }

  try {
    const stateRes = await fetch('https://whiteoutsurvival.dev/api/state-age?state=266');
    if (stateRes.ok) {
      const stateData = await stateRes.json();
      fs.writeFileSync(path.join(dataDir, 'state-age.json'), JSON.stringify(stateData, null, 2));
      console.log('Saved data/state-age.json');
    }
  } catch (err) {
    console.error('Error fetching state age:', err.message);
  }
}

syncData();
