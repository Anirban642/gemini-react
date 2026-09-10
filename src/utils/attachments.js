const textExtensions = [".txt", ".md", ".csv", ".json"];

export async function readAttachment(file) {
  const extension = `.${file.name.split(".").pop().toLowerCase()}`;

  if (textExtensions.includes(extension)) {
    return file.text();
  }

  if (extension === ".pdf") {
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
    const { default: pdfWorker } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    GlobalWorkerOptions.workerSrc = pdfWorker;
    const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(" "));
    }

    return pages.join("\n\n");
  }

  throw new Error("Supported files: .txt, .md, .csv, .json, and .pdf");
}
