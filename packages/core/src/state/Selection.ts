
export function selectSingle(store: any, id: string | null) {
    if (!id) store.setSelection([]);
    else store.setSelection([id]);
  }
  
  export function toggleSelection(store: any, id: string) {
    const s = store.getState().selection;
    if (s.includes(id)) store.setSelection(s.filter((x: string) => x !== id));
    else store.setSelection([...s, id]);
  }
  