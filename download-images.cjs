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

const imagesToDownload = [
  // 1. Atelier Low 01 (Minimalist White Sneaker)
  {
    folder: 'atelier-low-01',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'atelier-low-01',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'atelier-low-01',
    file: 'top.jpg',
    url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'atelier-low-01',
    file: 'detail.jpg',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop'
  },

  // 2. AeroStride Pro (Performance Runner)
  {
    folder: 'aerostride-runner',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'aerostride-runner',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'aerostride-runner',
    file: 'top.jpg',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop'
  },

  // 3. Monolith Chelsea (Suede Chelsea Boot)
  {
    folder: 'monolith-chelsea',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'monolith-chelsea',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'monolith-chelsea',
    file: 'detail.jpg',
    url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop'
  },

  // 4. Apex Lug Derby (Formal Leather Derby)
  {
    folder: 'apex-derby',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'apex-derby',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'apex-derby',
    file: 'detail.jpg',
    url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000&auto=format&fit=crop'
  },

  // 5. Phantom Shield Hiker (Trail Mountain Boot)
  {
    folder: 'phantom-hiker',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'phantom-hiker',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'phantom-hiker',
    file: 'detail.jpg',
    url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1000&auto=format&fit=crop'
  },

  // 6. Court Vintage 77 (Retro Gum-Sole Sneaker)
  {
    folder: 'court-vintage-77',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'court-vintage-77',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1512990414788-d97cb4a25db3?q=80&w=1000&auto=format&fit=crop'
  },

  // 7. Zenith Molded Slide (Minimalist Mules / Slides)
  {
    folder: 'zenith-slide',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'zenith-slide',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1627000086207-76eabf23aa2e?q=80&w=1000&auto=format&fit=crop'
  },

  // 8. Obsidian V-10 (Stealth Black Runner)
  {
    folder: 'obsidian-v10',
    file: 'main.jpg',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    folder: 'obsidian-v10',
    file: 'angle.jpg',
    url: 'https://images.unsplash.com/photo-1551107696-a4b085a6d966?q=80&w=1000&auto=format&fit=crop'
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
  console.log('Downloading images into', baseDir);

  for (const item of imagesToDownload) {
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
  console.log('Finished image downloads!');
}

run();
