import { LoadingManager } from "three";
import { useEffect, useState } from "react";

const mgr = new LoadingManager();

export function useGlobalProgress() {
  const [{ loaded, total }, setState] = useState({ loaded: 0, total: 0 });

  useEffect(() => {
    interface ProgressEventHandler {
      (url: string, itemsLoaded: number, itemsTotal: number): void;
    }

    const handle: ProgressEventHandler = (url, itemsLoaded, itemsTotal) =>
      setState({ loaded: itemsLoaded, total: itemsTotal });
    mgr.onProgress = handle;
    return () => { mgr.onProgress = () => {}; };
  }, []);

  const progress = total ? (100 * loaded) / total : 0;
  return progress;
}
