const TABLES = { partnership: "partnership_requests", franchise: "franchise_inquiries", contact: "contact_messages" } as const;
export type InboxKind = keyof typeof TABLES;
export const inboxTable = (k: string) => (k in TABLES ? TABLES[k as InboxKind] : null);
