export class DrivezClient {
  async uploadFile(file: File, presignedUrl: string): Promise<boolean> {
    const res = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!res.ok) {
      return false;
    }
    return true;
  }
}
