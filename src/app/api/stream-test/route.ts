const TWO_MINUTES = 2 * 60;

async function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const runtime = "edge";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  params.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for (let i = 0; i < TWO_MINUTES; i++) {
        await waitFor(1000);
        controller.enqueue(encoder.encode(i.toString()));
      }

      controller.close();
    },
  });

  const headers = new Headers();

  headers.set("Content-Type", "application/octet-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Content-Disposition", "attachment; filename=stream-test.txt");

  return new Response(readableStream, {
    headers,
  });
}
