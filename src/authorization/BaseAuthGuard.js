import { Session } from "@/lib/Session";
import { notFound, forbidden } from "next/navigation";

export class BaseAuthGuard {
  static async getSession() {
    return Session.getCurrentUser();
  }

  static redirectUnauthorized() {
    return forbidden();
  }

  static notFound() {
    return notFound();
  }
}
