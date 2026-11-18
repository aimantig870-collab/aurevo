import { requireStaff } from "@/lib/admin/auth";
import { settingDefaults } from "@/lib/data";
import { SettingsForm } from "@/components/admin-forms";
import { Card, Title } from "@/components/admin-bits";

export default async function Settings() {
  const { db, profile } = await requireStaff();
  const { data } = await db.from("brand_settings").select("key,value");
  const values = { ...settingDefaults, ...Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) };
  return (
    <>
      <Title>Site content &amp; brand information</Title>
      <Card><SettingsForm values={values} readOnly={profile.role === "viewer"} /></Card>
    </>
  );
}
