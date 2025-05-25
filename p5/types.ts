import { OptionalId } from "npm:mongodb";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  chatId:string;
}

export type ContactDB = OptionalId<Omit<Contact,"id">>;