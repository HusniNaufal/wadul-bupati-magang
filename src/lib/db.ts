import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_wadul_bupati',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper to run query
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

// Function to initialize tables and seed users
export async function initDb() {
  try {
    // 1. Create users table if not exists
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        dinas VARCHAR(100) NOT NULL
      )
    `);

    // 2. Create aduan table if not exists (to ensure database is populated or runs smoothly in testing environment)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS aduan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        no_tiket VARCHAR(50) UNIQUE NOT NULL,
        waktu_masuk VARCHAR(50) NOT NULL,
        dinas VARCHAR(100) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        isi_aduan TEXT NOT NULL,
        foto_bukti VARCHAR(255) DEFAULT NULL,
        status VARCHAR(20) DEFAULT 'Pending',
        nama_pelapor VARCHAR(100) NOT NULL DEFAULT 'Anonim',
        alamat_pelapor TEXT NOT NULL DEFAULT '',
        no_hp VARCHAR(20) NOT NULL DEFAULT '',
        judul_aduan VARCHAR(255) NOT NULL DEFAULT '',
        balasan_dinas TEXT DEFAULT NULL,
        waktu_balasan VARCHAR(50) DEFAULT NULL
      )
    `);

    // Ensure existing table has the new columns if it was already created by user's bot
    try { await pool.execute('ALTER TABLE aduan ADD COLUMN nama_pelapor VARCHAR(100) NOT NULL DEFAULT "Anonim"'); } catch (_) {}
    try { await pool.execute('ALTER TABLE aduan ADD COLUMN alamat_pelapor TEXT NOT NULL DEFAULT ""'); } catch (_) {}
    try { await pool.execute('ALTER TABLE aduan ADD COLUMN no_hp VARCHAR(20) NOT NULL DEFAULT ""'); } catch (_) {}
    try { await pool.execute('ALTER TABLE aduan ADD COLUMN judul_aduan VARCHAR(255) NOT NULL DEFAULT ""'); } catch (_) {}
    try { await pool.execute('ALTER TABLE aduan ADD COLUMN balasan_dinas TEXT DEFAULT NULL'); } catch (_) {}
    try { await pool.execute('ALTER TABLE aduan ADD COLUMN waktu_balasan VARCHAR(50) DEFAULT NULL'); } catch (_) {}


    // 3. Seed users if empty
    const [rows]: any = await pool.execute('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      console.log('Seeding default admin accounts...');
      // Plaintext check for validation as requested: user 'diskominfo' with 'admin123' and 'dukcapil' with 'dukcapil123'
      await pool.execute(
        'INSERT IGNORE INTO users (username, password, dinas) VALUES (?, ?, ?)',
        ['diskominfo', 'admin123', 'Diskominfo']
      );
      await pool.execute(
        'INSERT IGNORE INTO users (username, password, dinas) VALUES (?, ?, ?)',
        ['dukcapil', 'dukcapil123', 'Dukcapil']
      );
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Automatically trigger db init in background
initDb().catch((err) => console.error('Failed to init DB:', err));

export default pool;
