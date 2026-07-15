import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tiket = searchParams.get('tiket');

    if (tiket) {
      // Fetch specific complaint for ticket tracker
      const results: any[] = await query(
        'SELECT no_tiket, waktu_masuk, dinas, kategori, status, isi_aduan, foto_bukti, nama_pelapor, alamat_pelapor, no_hp, judul_aduan, balasan_dinas, waktu_balasan FROM aduan WHERE no_tiket = ?',
        [tiket]
      );

      if (results.length === 0) {
        return NextResponse.json(
          { error: 'Ticket not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: results[0] });
    } else {
      // Fetch 5 most recent complaints for public feed
      const results = await query(
        'SELECT no_tiket, waktu_masuk, dinas, kategori, status, nama_pelapor, no_hp, judul_aduan, isi_aduan, balasan_dinas, waktu_balasan, foto_bukti, alamat_pelapor FROM aduan ORDER BY id DESC LIMIT 5'
      );
      return NextResponse.json({ success: true, data: results });
    }
  } catch (error: any) {
    console.error('Public Aduan API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
