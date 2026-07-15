import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dinas = searchParams.get('dinas');

    if (!dinas) {
      return NextResponse.json(
        { error: 'Dinas parameter is required' },
        { status: 400 }
      );
    }

    let results;
    if (dinas.toLowerCase() === 'diskominfo') {
      results = await query('SELECT * FROM aduan ORDER BY id DESC');
    } else {
      results = await query(
        'SELECT * FROM aduan WHERE dinas = ? ORDER BY id DESC',
        [dinas]
      );
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Admin GET Aduan API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, balasan_dinas } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and Status are required' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['Pending', 'Proses', 'Selesai'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Generate formatted date if response is set
    let result: any;
    if (balasan_dinas !== undefined) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + now.toLocaleTimeString('id-ID', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\:/g, '.');

      result = await query(
        'UPDATE aduan SET status = ?, balasan_dinas = ?, waktu_balasan = ? WHERE id = ?',
        [status, balasan_dinas, formattedDate, id]
      );
    } else {
      result = await query(
        'UPDATE aduan SET status = ? WHERE id = ?',
        [status, id]
      );
    }

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Complaint record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error: any) {
    console.error('Admin PATCH Aduan API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
