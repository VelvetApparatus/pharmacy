import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "./server/api/root";
import { Category } from "./server/db/schema";

export type Product = inferProcedureOutput<AppRouter["product"]["getAll"]>[number];
export type Discount = inferProcedureOutput<AppRouter["discount"]["getAll"]>[number];
export type Order = inferProcedureOutput<AppRouter["order"]["getAll"]>[number];

export function CategoryToData(category: Category) {
  switch (category) {
    case "VIRUS": {
      return {
        name: "Противовирусные средства",
        icon: "/virus.svg",
      }
    }
    case "NOSE": {
      return {
        name: "От насморка",
        icon: "/nose.svg",
      }
    }
    case "THROAT": {
      return {
        name: "Здоровье горла",
        icon: "/throat.svg",
      }
    }
    case "COLD": {
      return {
        name: "Лечение простуды",
        icon: "/cold.svg",
      }
    }
    case "HIGH_BLOOD_PRESSURE": {
      return {
        name: "От повышенного давления",
        icon: "/high_blood_pressure.svg",
      }
    }
    case "LOW_BLOOD_PRESSURE": {
      return {
        name: "От пониженного давления",
        icon: "/low_blood_pressure.svg",
      }
    }
    case "ALLERGY": {
      return {
        name: "Лечение аллергии",
        icon: "/allergy.svg",
      }
    }
    case "HEARTBURN": {
      return {
        name: "От изжоги",
        icon: "/heartburn.svg",
      }
    }
  }
}

export async function ImagesToBase64(images: File[]): Promise<string[]> {
  const imagesBase64 = await Promise.all(
    images.map(async (image) => {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      return base64;
    })
  );
  return imagesBase64 as string[];
}

export async function Base64ToFile(base64: string): Promise<File> {
  const parts = base64.split(';base64,');

  if (parts.length !== 2) {
    throw new Error('Invalid base64 string');
  }

  const contentType = parts[0]!.split(':')[1];
  const base64Data = parts[1];

  const byteCharacters = atob(base64Data!);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });

  const file = new File([blob], `file.${contentType!.split('/')[1]}`, { type: contentType });

  return file;
}

