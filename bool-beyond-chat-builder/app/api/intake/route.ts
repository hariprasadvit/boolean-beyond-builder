import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const payload = data.get('payload');
    console.log('Intake received:', payload);
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown' }, { status: 500 });
  }
}
