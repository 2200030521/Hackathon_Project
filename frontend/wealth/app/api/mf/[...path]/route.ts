import { NextRequest, NextResponse } from "next/server";

const MF_URL = process.env.MF_API_URL || "http://localhost:4002";
const MF_KEY = process.env.MF_API_KEY || "MF_SECRET_KEY";

async function proxy(
  request: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  const path = pathSegments.join("/");
  const url = `${MF_URL}/api/${path}${request.nextUrl.search}`;

  const headers: Record<string, string> = {
    "x-api-key": MF_KEY,
    "Content-Type": "application/json",
  };

  const auth = request.headers.get("authorization");
  if (auth) headers.authorization = auth;

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.text();
    if (body) init.body = body;
  }

  try {
    const upstream = await fetch(url, init);
    const data = await upstream.text();
    return new NextResponse(data, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "MF service unavailable" },
      { status: 502 }
    );
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
