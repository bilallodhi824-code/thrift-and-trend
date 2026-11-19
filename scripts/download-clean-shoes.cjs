const fs = require('fs');
const path = require('path');
const https = require('https');

// Custom DNS helper
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const origLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return origLookup(hostname, options, callback);
  }
  dns.resolve4(hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      if (options && options.all) {
        return callback(null, addresses.map(addr => ({ address: addr, family: 4 })));
      }
      return callback(null, addresses[0], 4);
    }
    return origLookup(hostname, options, callback);
  });
};

const cleanShoeImages = [
  // 1. Aero Velocity '86 (Classic Crimson Red Runner)
  {
    folder: 'aero-velocity-86',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85'
  },
  // 2. Atelier Classic 01 (Clean White Leather Sneaker)
  {
    folder: 'atelier-classic-01',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=85'
  },
  {
    folder: 'atelier-classic-01',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85'
  },
  // 3. Volt Kinetic Racer (Electric Neon Lime Runner)
  {
    folder: 'volt-kinetic-racer',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1000&q=85'
  },
  // 4. Deck Street Low (Black & White Skater Sneaker)
  {
    folder: 'deck-street-low',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85'
  },
  // 5. Palermo Heritage '78 (Gum Sole White Trainer)
  {
    folder: 'palermo-heritage-78',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=85'
  },
  // 6. Obsidian Stealth Pro (Blackout Road Runner)
  {
    folder: 'obsidian-stealth-pro',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=85'
  },
  // 7. Savile Cap-Toe Oxford (Polished Brown Leather Dress Shoe)
  {
    folder: 'savile-cap-oxford',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=85'
  },
  // 8. Monolith Suede Chelsea (Suede Tobacco Chelsea Boot)
  {
    folder: 'monolith-suede-chelsea',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=85'
  },
  // 9. Archival High '70 (Red Canvas High-Top Sneaker)
  {
    folder: 'archival-high-70',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1000&q=85'
  },
  // 10. Alpine Ridge Hiker (Leather Mountain Hiking Boot)
  {
    folder: 'alpine-ridge-hiker',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1000&q=85'
  },
  // 11. Grand Slam Vintage '74 (Perforated Court Sneaker)
  {
    folder: 'grand-slam-vintage-74',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&w=1000&q=85'
  },
  // 12. Monochrome Archive Runner (Off-White Suede & Mesh)
  {
    folder: 'monochrome-archive-runner',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1512990414788-d97cb4a25db3?auto=format&fit=crop&w=1000&q=85'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    function fetchWithRedirect(targetUrl) {
      https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchWithRedirect(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Status ${res.statusCode} for ${targetUrl}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }
    fetchWithRedirect(url);
  });
}

async function run() {
  const baseDir = path.join(__dirname, 'public', 'images', 'shoes');
  console.log('Downloading 100% clean studio shoe photos into', baseDir);

  for (const item of cleanShoeImages) {
    const targetDir = path.join(baseDir, item.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const destPath = path.join(targetDir, item.file);
    try {
      console.log(`Downloading ${item.folder}/${item.file}...`);
      await downloadFile(item.url, destPath);
      console.log(`✓ Saved ${item.folder}/${item.file}`);
    } catch (e) {
      console.error(`✗ Error downloading ${item.folder}/${item.file}:`, e.message);
    }
  }
  console.log('Finished clean shoe downloads!');
}

run();
