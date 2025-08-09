import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: any = {};
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const data = await req.formData();
      payload = data.get('payload');
    }
    console.log('Intake received:', payload);
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown' }, { status: 500 });
  }
}
