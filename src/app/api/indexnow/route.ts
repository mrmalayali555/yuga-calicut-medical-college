import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const INDEXNOW_KEY = "e7b94a8c3d1f42069b83f5127d4c8e19";
const INDEXNOW_KEY_LOCATION = `${SITE.url}/${INDEXNOW_KEY}.txt`;

const CORE_URLS = [
  `${SITE.url}/`,
  `${SITE.url}/about`,
  `${SITE.url}/events`,
  `${SITE.url}/interventions`,
  `${SITE.url}/achievements`,
  `${SITE.url}/emergency`,
  `${SITE.url}/calendar`,
  `${SITE.url}/notifications`,
  `${SITE.url}/subcommittees`,
  `${SITE.url}/contact`,
  `${SITE.url}/finance`,
  `${SITE.url}/complaints`,
  `${SITE.url}/monument`,
  `${SITE.url}/clubs/jeevanam`,
  `${SITE.url}/clubs/praanah`,
  `${SITE.url}/clubs/godha`,
  `${SITE.url}/clubs/ocha`,
];

async function submitToIndexNow(urls: string[]) {
  const host = new URL(SITE.url).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  return {
    status: response.status,
    statusText: response.statusText,
    submittedCount: urls.length,
    urls,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] = Array.isArray(body?.urls) && body.urls.length > 0
      ? body.urls
      : CORE_URLS;

    const result = await submitToIndexNow(urls);
    return NextResponse.json({
      success: result.status >= 200 && result.status < 300,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to submit to IndexNow" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await submitToIndexNow(CORE_URLS);
    return NextResponse.json({
      message: "IndexNow ping executed for core canonical URLs",
      success: result.status >= 200 && result.status < 300,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to trigger IndexNow" },
      { status: 500 }
    );
  }
}
