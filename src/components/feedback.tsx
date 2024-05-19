"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Mail } from "lucide-react";
import { api } from "~/trpc/react";
import { useToast } from "./ui/use-toast";

export default function Feedback() {
  const [email, setEmail] = useState("");

  const toast = useToast();

  const createFeedbackMutation = api.feedback.create.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Спасибо за вашу заявку!",
        description: "Мы свяжемся с вами в ближайшее время.",
      })
      setEmail("");
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  });

  return (
    <div className="flex flex-col gap-1">
      <p>Получить индвидуальную консультацию</p>
      <div className="relative h-10">
        <Input value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <button
          onClick={() => createFeedbackMutation.mutate({ email })}
          className="top-0 text-border hover:text-white right-0 absolute h-full aspect-square hover:bg-border rounded-r-md transition-all ease-in-out duration-300 flex items-center justify-center">
          <Mail />
        </button>
      </div>
    </div>
  );
}
