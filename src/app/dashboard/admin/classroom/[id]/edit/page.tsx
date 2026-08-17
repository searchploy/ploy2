import { createClient } from "@/lib/supabase/server";
import { ModuleForm } from "../../module-form";
import { notFound } from "next/navigation";

export default async function EditModulePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: module, error } = await supabase
    .from("classroom_modules")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !module) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Module</h1>
        <p className="text-muted-foreground mt-2">Update the learning module</p>
      </div>
      <ModuleForm module={module} />
    </div>
  );
}
