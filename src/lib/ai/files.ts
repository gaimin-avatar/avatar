function getContentType(file: File) {
  return file.type || "image/png";
}

export async function fileToDataUri(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${getContentType(file)};base64,${buffer.toString("base64")}`;
}

export function parseDataUri(dataUri: string) {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Image data must be a valid base64 data URI.");
  }

  return {
    mimeType: match[1],
    base64Data: match[2],
  };
}

