export interface Aduan {
  id: number;
  no_tiket: string;
  waktu_masuk: string;
  dinas: 'Dukcapil' | 'Dinas PUPR' | 'Dinas Kesehatan' | 'Dishub' | 'PKPLH' | 'Disdikpora' | 'Lainnya';
  kategori: string;
  isi_aduan: string;
  foto_bukti: string | null;
  status: 'Pending' | 'Proses' | 'Selesai';
  nama_pelapor: string;
  alamat_pelapor: string;
  no_hp: string;
  judul_aduan: string;
  balasan_dinas: string | null;
  waktu_balasan: string | null;
}

export interface User {
  id: number;
  username: string;
  dinas: string;
}
