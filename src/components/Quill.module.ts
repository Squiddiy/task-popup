import Quill from "quill";
import Link from "quill/formats/link";
import ImageBlot from "quill/blots/embed";
import "quill/dist/quill.snow.css";
import axios from "axios";
declare global {
  interface Window {
    initQuillTextEditor: (id: string, image?: boolean) => Quill;
    getAddedQuillImages: () => string[];
    resetAddedQuillImages: () => void;
    popAddedQuillImages: () => string[];
  }
}

export const formats = [
  "bold",
  "color",
  "italic",
  "link",
  "strike",
  "underline",
  "list",
];
export const toolbarOptions = [
  [{ color: [] }],
  ["bold", "italic", "underline", "strike"],
  ["link"],
  [{ list: "bullet" }],
];
const quillInstances: Record<string, Quill> = {};
let addedImages: string[] = [];

class CustomLink extends Link {
  static sanitize(url: string) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `http://${url}`;
    }
    return url;
  }
}
Quill.register("formats/link", CustomLink, true);

class CustomImageBlot extends ImageBlot {
  static blotName = "customImage";
  static tagName = "img";
  static className = "quill-custom-image";

  static create(value: { url: string; imageId?: string }) {
    const node = super.create() as HTMLImageElement;
    node.setAttribute("src", value.url);
    if (value.imageId) {
      node.setAttribute("data-image-id", value.imageId);
    }
    return node;
  }

  static value(node: HTMLElement) {
    return {
      url: node.getAttribute("src") || "",
      imageId: node.getAttribute("data-image-id") || "",
    };
  }
}

Quill.register(CustomImageBlot);

const uploadImageFile = async (
  formData: FormData,
  editor: Quill,
  reader: FileReader
) => {
  const response = await axios.post<string>(
    "/api/FileService/UploadFile",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  const result = response.data;
  const base64 = reader.result?.toString();
  const range = editor.getSelection(true) ?? {
    index: editor.getLength(),
    length: 0,
  };

  addedImages.push(result);

  editor.insertEmbed(range.index, "customImage", {
    url: base64,
    imageId: result,
  });
  editor.setSelection(range.index + 1);
};

const handleImageUpload = async (editorId: string) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const imageItem = file.type.startsWith("image/");
    if (!imageItem) return;

    const formData = new FormData();
    formData.append("file", file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      await uploadImageFile(formData, quillInstances[editorId], reader);
    };
  };
};
export function initQuillTextEditor(id: string, image: boolean = false): Quill {
  if (quillInstances[id]) {
    return quillInstances[id];
  }

  const localFormats = [...formats];
  const localToolbarOptions = [...toolbarOptions];

  if (image) {
    localFormats.push("customImage");
    localToolbarOptions.push(["image"]);
  }

  const quill = new Quill(id, {
    formats: localFormats,
    modules: {
      toolbar: {
        container: localToolbarOptions,
        handlers: {
          image: () => handleImageUpload(id),
        },
        clipboard: image,
      },
    },
    bounds: id,
    theme: "snow",
  });

  const editorEl = document.querySelector(id + " .ql-editor");
  if (image && editorEl) {
    editorEl.addEventListener("paste", async (e) => {
      const clipboardEvent = e as ClipboardEvent;
      if (!clipboardEvent.clipboardData) return;
      const items = Array.from(clipboardEvent.clipboardData.items);
      const imageItem = items.find(
        (item) => item.kind === "file" && item.type.startsWith("image/")
      );
      if (!imageItem) return;

      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          await uploadImageFile(formData, quill, reader);
        } catch (error) {
          console.error("Failed to upload pasted image:", error);
        }
      };
    });

    editorEl.addEventListener("drop", async (e) => {
      const dragevent = e as DragEvent;
      e.preventDefault();

      const files = Array.from(dragevent.dataTransfer?.files || []);
      const imageFile = files.find((file) => file.type.startsWith("image/"));
      if (!imageFile) return;

      const formData = new FormData();
      formData.append("file", imageFile);

      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async () => {
        try {
          await uploadImageFile(formData, quill, reader);
        } catch (err) {
          console.error("Drag-drop image upload failed:", err);
        }
      };
    });
  }

  quillInstances[id] = quill;
  return quill;
}

export function getAddedQuillImages(): string[] {
  return addedImages;
}

export function resetAddedQuillImages(): void {
  addedImages = [];
}

export function popAddedQuillImages(): string[] {
  const returnArray: string[] = [...addedImages];
  addedImages = [];
  return returnArray;
}
