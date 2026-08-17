import { ModuleForm } from "../module-form";

export default function NewModulePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Module</h1>
        <p className="text-muted-foreground mt-2">Add a new learning module to the classroom</p>
      </div>
      <ModuleForm />
    </div>
  );
}
