import Feedback from "./feedback";
import { Logo } from "./navbar";

export default function Footer() {
  return (
    <div className="min-h-56 w-screen bg-secondary text-secondary-foreground">
      <div className="container mx-auto flex flex-col md:flex-row min-h-56 gap-4 py-10">
        <div className="flex flex-row grow items-center justify-center md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-col md:items-end justify-center gap-4">
          <Feedback />
          <p className="text-muted-foreground">© {new Date().getFullYear()}. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
}
