"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { FeedbackStatus, feedbackStatus } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

function FeedbackStatusBadge({
  status
}: {
  status: FeedbackStatus
}) {
  let data: {
    title: string;
    color: string;
  }

  switch (status) {
    case "OPEN": {
      data = {
        title: "Открыт",
        color: "bg-green-500"
      }
      break;
    }
    case "CLOSED": {
      data = {
        title: "Закрыт",
        color: "bg-red-500"
      }
      break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${data.color}`}
    >
      {data.title}
    </span>
  )
}

export default function UpdateFeedbackStatus({
  id,
  status
}: {
  id: string
  status: FeedbackStatus
}) {
  const router = useRouter();
  const toast = useToast();

  const [newStatus, setNewStatus] = useState<FeedbackStatus>(status);

  const updateStatusMutation = api.feedback.updateStatus.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toast.toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  })

  useEffect(() => {
    if (newStatus === status) return;

    updateStatusMutation.mutate({ id, status: newStatus })
  }, [newStatus])

  return (
    <Select value={newStatus} onValueChange={(val) => setNewStatus(val as FeedbackStatus)}>
      <SelectTrigger className="border-0 w-fit gap-2 bg-transparent ring-0 focus-visible:ring-0">
        <SelectValue placeholder="Статус обратной связи" />
      </SelectTrigger>
      <SelectContent>
        {feedbackStatus.enumValues.map((s) => (
          <SelectItem key={s} value={s}>
            <FeedbackStatusBadge status={s} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
