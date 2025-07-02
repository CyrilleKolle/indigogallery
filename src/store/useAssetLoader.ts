'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';

export type TextureDict<T extends readonly string[]> = Record<T[number], THREE.Texture>;

/**
 * Loads all the given URLs via THREE.TextureLoader.
 * Returns [textureMapOrNull, loadedBoolean, errorObject?].
 */
export default function useAssetLoader<const Urls extends readonly string[]>(
  urls: Urls
): [TextureDict<Urls> | null, boolean, Error?] {
  const [textures, setTextures] =
    useState<TextureDict<Urls> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let alive = true;

    // Local mutable map while loading
    const map = {} as TextureDict<Urls>;

    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
      if (alive) {
        setTextures(map);
        setLoaded(true);
      }
    };
    manager.onError = (url) => {
      if (alive) setError(new Error(`Failed to load ${url}`));
    };

    const loader = new THREE.TextureLoader(manager);
    urls.forEach((url) => {
      loader.load(
        url,
        (tex) => {
          map[url as Urls[number]] = tex as THREE.Texture;
        },
        undefined,
        () => {
          /* manager.onError will fire */
        }
      );
    });

    return () => {
      alive = false;           // stop setState after unmount
    };
    // key the effect by *value* not identity
  }, [JSON.stringify(urls)]);

  return [textures, loaded, error];
}
