"use client";

import { Category } from "~/server/db/schema";
import Heartburn from "../../public/descriptions/heartburn.mdx"
import Virus from "../../public/descriptions/virus.mdx"
import Nose from "../../public/descriptions/nose.mdx"
import Throat from "../../public/descriptions/throat.mdx"
import Cold from "../../public/descriptions/cold.mdx"
import HighBloodPressure from "../../public/descriptions/high_blood_pressure.mdx"
import LowBloodPressure from "../../public/descriptions/low_blood_pressure.mdx"
import Allergy from "../../public/descriptions/allergy.mdx"
import { Separator } from "./ui/separator";

export default function RenderMDX({
  category
}: {
  category: Category
}) {
  return (
    <div className="prose container mx-auto px-10 text-start py-8 !max-w-fit">
      <Separator />
      {category === "HEARTBURN" && <Heartburn />}
      {category === "VIRUS" && <Virus />}
      {category === "NOSE" && <Nose />}
      {category === "THROAT" && <Throat />}
      {category === "COLD" && <Cold />}
      {category === "HIGH_BLOOD_PRESSURE" && <HighBloodPressure />}
      {category === "LOW_BLOOD_PRESSURE" && <LowBloodPressure />}
      {category === "ALLERGY" && <Allergy />}
    </div>
  )
}
