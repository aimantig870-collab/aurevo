import { requireStaff } from "@/lib/admin/auth";
import { deleteCategory } from "@/lib/admin/actions";
import { CategoryForm } from "@/components/admin-forms";
import { Title } from "@/components/admin-bits";
import { ConfirmButton } from "@/components/admin-ui";

export default async function Categories() {
  const { db, profile } = await requireStaff();
  const readOnly = profile.role === "viewer";
  const { data } = await db.from("categories").select("*").order("sort_order");
  return (
    <>
      <Title>Menu categories</Title>
      <div className="grid gap-4">
        {data?.map((c) => (
          <div key={c.id}><CategoryForm c={c} readOnly={readOnly} />
            {!readOnly && <form action={deleteCategory} className="mt-1 text-right"><input type="hidden" name="id" value={c.id} /><ConfirmButton message={`Delete category “${c.name}”?`} className="text-xs text-ember underline">Delete “{c.name}”</ConfirmButton></form>}</div>
        ))}
      </div>
      {!readOnly && <><h2 className="mb-3 mt-10 font-display text-3xl">Add category</h2><CategoryForm readOnly={false} /></>}
    </>
  );
}
