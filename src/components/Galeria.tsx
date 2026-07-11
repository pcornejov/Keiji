import { useCallback, useEffect, useRef, useState } from 'react';

interface ItemGaleria {
  imagen_url: string;
  titulo: string;
  descripcion: string;
  fuente: string;
  url_fuente: string;
}

interface Props {
  items: ItemGaleria[];
}

const DURACION_TRANSICION_MS = 220;

/**
 * Grid de miniaturas + lightbox modal, en una sola isla React (client:load).
 * Se combinan en un solo componente porque cada botón del mosaico necesita
 * disparar la apertura del lightbox en su índice correspondiente; mantener
 * ambos dentro del mismo árbol de React evita hacks de comunicación entre
 * HTML estático de Astro y la isla.
 */
export default function Galeria({ items }: Props) {
  const [indiceActivo, setIndiceActivo] = useState<number | null>(null);
  const [cerrando, setCerrando] = useState(false);

  const disparadorRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const botonCerrarRef = useRef<HTMLButtonElement | null>(null);
  const cierreTimeoutRef = useRef<number | undefined>(undefined);

  const abierto = indiceActivo !== null;
  const itemActivo = indiceActivo !== null ? items[indiceActivo] : null;

  const abrir = useCallback((indice: number, elementoDisparador: HTMLElement) => {
    if (cierreTimeoutRef.current !== undefined) {
      window.clearTimeout(cierreTimeoutRef.current);
      cierreTimeoutRef.current = undefined;
    }
    disparadorRef.current = elementoDisparador;
    setCerrando(false);
    setIndiceActivo(indice);
    document.body.style.overflow = 'hidden';
  }, []);

  const cerrar = useCallback(() => {
    setCerrando(true);
    cierreTimeoutRef.current = window.setTimeout(() => {
      setIndiceActivo(null);
      setCerrando(false);
      document.body.style.overflow = '';
      disparadorRef.current?.focus();
      cierreTimeoutRef.current = undefined;
    }, DURACION_TRANSICION_MS);
  }, []);

  const anterior = useCallback(() => {
    setIndiceActivo((indice) => {
      if (indice === null) return indice;
      return (indice - 1 + items.length) % items.length;
    });
  }, [items.length]);

  const siguiente = useCallback(() => {
    setIndiceActivo((indice) => {
      if (indice === null) return indice;
      return (indice + 1) % items.length;
    });
  }, [items.length]);

  // Mueve el foco al botón de cerrar apenas se abre el lightbox.
  useEffect(() => {
    if (abierto) {
      const id = window.requestAnimationFrame(() => {
        botonCerrarRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, [abierto]);

  // Teclado global mientras el lightbox está abierto: Escape, flechas y
  // atrapado de foco (Tab) dentro del diálogo.
  useEffect(() => {
    if (!abierto) return;

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        cerrar();
        return;
      }
      if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        anterior();
        return;
      }
      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        siguiente();
        return;
      }
      if (evento.key === 'Tab') {
        const contenedor = lightboxRef.current;
        if (!contenedor) return;
        const focoables = contenedor.querySelectorAll<HTMLElement>(
          'button, a[href]',
        );
        if (focoables.length === 0) return;
        const primero = focoables[0];
        const ultimo = focoables[focoables.length - 1];
        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primero.focus();
        }
      }
    }

    document.addEventListener('keydown', manejarTecla);
    return () => document.removeEventListener('keydown', manejarTecla);
  }, [abierto, cerrar, anterior, siguiente]);

  // Restaura el scroll del body si el componente se desmonta con el
  // lightbox abierto.
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      if (cierreTimeoutRef.current !== undefined) {
        window.clearTimeout(cierreTimeoutRef.current);
      }
    };
  }, []);

  function manejarClickOverlay(evento: React.MouseEvent<HTMLDivElement>) {
    if (evento.target === evento.currentTarget) {
      cerrar();
    }
  }

  return (
    <>
      <div className="galeria-grid">
        {items.map((item, indice) => (
          <button
            key={item.imagen_url}
            type="button"
            className="galeria-item"
            data-indice={indice}
            aria-haspopup="dialog"
            onClick={(evento) => abrir(indice, evento.currentTarget)}
          >
            <img
              className="galeria-item__imagen"
              src={item.imagen_url}
              alt=""
              loading="lazy"
              width="400"
              height="400"
            />
            <span className="galeria-item__overlay">
              <span className="galeria-item__titulo">{item.titulo}</span>
            </span>
          </button>
        ))}
      </div>

      <div
        ref={lightboxRef}
        className={`lightbox${abierto ? ' lightbox--visible' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={itemActivo?.titulo ?? 'Visor de imagen'}
        hidden={indiceActivo === null && !cerrando ? true : undefined}
        onClick={manejarClickOverlay}
      >
        <button
          ref={botonCerrarRef}
          type="button"
          className="lightbox__cerrar"
          aria-label="Cerrar"
          onClick={cerrar}
        >
          ×
        </button>

        <div className="lightbox__contenido" onClick={(evento) => evento.stopPropagation()}>
          <img
            className="lightbox__imagen"
            src={itemActivo?.imagen_url}
            alt={itemActivo?.titulo ?? ''}
          />
          <div className="lightbox__pie">
            <h2 className="lightbox__titulo">{itemActivo?.titulo}</h2>
            <p className="lightbox__descripcion">{itemActivo?.descripcion}</p>
            <a
              className="lightbox__fuente"
              href={itemActivo?.url_fuente}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver fuente ({itemActivo?.fuente})
            </a>
          </div>
        </div>

        <nav className="lightbox__nav" aria-label="Navegación de la galería">
          <button
            type="button"
            className="lightbox__nav-boton lightbox__nav-boton--prev"
            aria-label="Imagen anterior"
            onClick={anterior}
          >
            ‹
          </button>
          <button
            type="button"
            className="lightbox__nav-boton lightbox__nav-boton--next"
            aria-label="Imagen siguiente"
            onClick={siguiente}
          >
            ›
          </button>
        </nav>
      </div>
    </>
  );
}
