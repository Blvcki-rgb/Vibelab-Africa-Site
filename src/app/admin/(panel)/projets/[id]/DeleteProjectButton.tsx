"use client";

import { deleteProject } from "../../actions";

export function DeleteProjectButton({ id }: { id: number }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(e) => {
        if (!window.confirm("Supprimer définitivement ce projet ? Cette action est irréversible.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="cursor-pointer border-0 bg-transparent p-0 text-sm text-muted underline hover:text-saffron">
        Supprimer ce projet
      </button>
    </form>
  );
}
