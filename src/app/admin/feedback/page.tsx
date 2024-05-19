import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { api } from "~/trpc/server";
import { format } from "date-fns";
import UpdateFeedbackStatus from "./status";

export default async function Feedback() {
  const feedback = await api.feedback.getAll();

  return (
    <div className="w-full space-y-8 overflow-hidden">
      <div className="flex flex-row w-full justify-between">
        <p className="font-bold text-4xl">Обратная связь</p>
      </div>
      <Table className="text-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll">
          {feedback.map((f) => (
            <TableRow>
              <TableCell>
                {format(f.createdAt, "dd.MM.yyyy")}
              </TableCell>
              <TableCell>
                {f.email}
              </TableCell>
              <TableCell>
                <UpdateFeedbackStatus id={f.id} status={f.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
